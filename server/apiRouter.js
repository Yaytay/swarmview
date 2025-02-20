import express from "express";
import proxy from "express-http-proxy"
import { performance } from "node:perf_hooks";
import 'dotenv/config'

const router = express.Router();

const endpoint = process.env.DOCKER_PROXY_ENDPOINT || 'dockerproxy:2375'

if (!process.env.DOCKER_PROXY_ENDPOINT) {
  console.log('Set the environment variable DOCKER_PROXY_ENDPOINT to configure the primary docker endpoint')
}

const service = process.env.DOCKER_PROXY_SERVICE
const service_port = process.env.DOCKER_PROXY_SERVICE_PORT || '2375'
const workers_service = process.env.DOCKER_PROXY_WORKERS_SERVICE
const workers_service_port = process.env.DOCKER_PROXY_WORKERS_SERVICE_PORT || '2375'
const service_redirect = JSON.parse(process.env.DOCKER_PROXY_SERVICE_REDIRECT || '{}')

if (!process.env.DOCKER_PROXY_SERVICE) {
  console.log('Set the environment variable DOCKER_PROXY_SERVICE to enable dynamic discovery of docker services.\n'
    + 'This is only used for functionality that requires access to all nodes (such as port exposure).\n'
    + 'This can only work when running inside a swarm.\n'
    + 'If only some of the nodes in the swarm are managers set DOCKER_PROXY_SERVICE to the manager service\n'
    + 'and DOCKER_PROXY_WORKERS_SERVICE to the workers service.\n'
  )
}

const serviceProxiesUrl = 'http://' + endpoint + '/v1.45/tasks?filters={%22name%22:[%22' + service + '%22],%22desired-state%22:[%22running%22]}'
const workersServiceProxiesUrl = workers_service ? 'http://' + endpoint + '/v1.45/tasks?filters={%22name%22:[%22' + workers_service + '%22],%22desired-state%22:[%22running%22]}' : null

router.use('/docker', proxy(endpoint, {
  filter: (req) => {
    console.log('Request to ' + req.url)
    return req.method === 'GET'
  }
  , proxyErrorHandler: function(err, res) {  
    let status = 500
    console.log('Reporting err ' + err + ' as ' + status)
    return res.status(status).send(String(err))
  }
}))

// Get all the exports for one image
function getExportsForImage(result, url) {
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      if (j.Config.ExposedPorts && Array.isArray(j.RepoDigests)) {
        j.RepoDigests.forEach(digest => {
          result[digest.replace(/:.*@/, "@")] = Object.keys(j.Config.ExposedPorts)          
        })

      }
    })
    .catch(ex => {
      console.log('Failed to get ' + url + ': ', ex)
    })
}

// Get all the exports for all the images known one on host
function getExportsForKnownImages(result, host) {
  const url = 'http://' + host + '/v1.45/images/json'
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      const promises = []
      if (Array.isArray(j)) {
        // console.log('Found ' + j.length + ' images at ' + url)
        j.forEach(img => {
          if (img.Id) {
            promises.push(
              getExportsForImage(result, 'http://' + host + '/v1.45/images/' + img.Id + '/json')
            )
          }
        })
        return Promise.all(promises)
      }
    })
    .catch(ex => {
      console.log('Failed to get ' + url + ': ', ex)
    })
}

// Get docker system info for one host
function getSystemInfo(host) {
  const url = 'http://' + host + '/v1.45/info'
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      return j
    })
}

// Inspect container on a host given its task ID
function getContainerDetails(host, taskid) {
  const urlQuery = 'http://' + host + '/v1.45/containers/json?filters={%22label%22:[%22com.docker.swarm.task.id=' + taskid + '%22]}'
  return fetch(urlQuery)
    .then(r => r.json())
    .then(j => {
      if (Array.isArray(j) && j.length > 0) {
        const url = 'http://' + host + '/v1.45/containers/' + j[0].Id + '/json'
        const prom1 = fetch(url).then(r => r.json())  
        const urlTop = 'http://' + host + '/v1.45/containers/' + j[0].Id + '/top'
        const prom2 = fetch(urlTop).then(r => r.json())

        return Promise.all([prom1, prom2]).then(v => {
          return {
            container: v[0]
            , top: v[1]
          }
        })
      } else {
        console.log('URL ' + urlQuery + ' returned ', j)
        return Promise.reject(new HttpError(404, 'Unable to get container ID'))
      }
    })
}

function redirectServiceUrl(dockerProxyHost) {
  if (service_redirect && service_redirect[dockerProxyHost]) {
    // console.log('Using ' + service_redirect[dockerProxyHost] + ' instead of ' + dockerProxyHost)
    return service_redirect[dockerProxyHost]
  } else {
    return dockerProxyHost
  }
}

// Get all the exports known to any of the hosts running the docker proxy
function getExportsFromAllDockerProxies(result, url, svc, port) {
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      const promises = []
      if (Array.isArray(j)) {
        j.forEach(tsk => {
          if (tsk.ID && tsk.NodeID && tsk.Status.State === 'running') {
            let dockerProxyHost = redirectServiceUrl(svc + '.' + tsk.NodeID + '.' + tsk.ID + ':' + port)
            promises.push(getExportsForKnownImages(result, dockerProxyHost))
          }
        })
        return Promise.all(promises)
      }
    })
    .catch(ex => {
      console.log('Failed to get ' + url + ': ', ex)
    })
}

router.use('/api/exposed', (_, res) => {
  if (!service) {
    res.status(404).send('Not configured for image processing')
  }

  const result = {}
  const promises = []
  promises.push(getExportsFromAllDockerProxies(result, serviceProxiesUrl, service, service_port))
  if (workersServiceProxiesUrl) {
    promises.push(getExportsFromAllDockerProxies(result, workersServiceProxiesUrl, workers_service, workers_service_port))
  }
  Promise.all(promises)
    .then(() => {
      res.send(JSON.stringify(result))
    })
    .catch(reason => {
      console.log('Failed to get docker proxy tasks:', reason)
      res.status(500).send('Failed to get docker proxy tasks')
    })
})

// Return an error with an HTTP status code
class HttpError extends Error {
  constructor(status, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.statusCode = status
  }
}

// Return a promise containing the URL to use for a given node
// The result cannot be (easily) cached because the proxy URL may change for a given node
function getDockerApiEndpointForNode(nodeid) {
  if (!service) {
    return Promise.reject(new HttpError(404, 'Not configured for node-based data'))
  }
  const promises = []
  serviceProxiesUrl && promises.push(getDockerApiUrlForNodeForGivenProxyUrl(nodeid, serviceProxiesUrl, service, service_port))
  workersServiceProxiesUrl && promises.push(getDockerApiUrlForNodeForGivenProxyUrl(nodeid, workersServiceProxiesUrl, workers_service, workers_service_port));

  return Promise.all(promises)
      .then(results => results.find(Boolean))
      .then(url => {
        return url;
      })
      .catch(error => {
        throw new HttpError(404, 'Cannot find proxy service for node ' + nodeid);
      })
}

function getDockerApiUrlForNodeForGivenProxyUrl(nodeid, proxyUrl, proxyServiceName, proxyServicePort) {
  console.log(proxyUrl)
  return fetch(proxyUrl)
    .then(r => r.json())
    .then(j => {
      if (Array.isArray(j)) {
        const tsk = j.filter(tsk => tsk.NodeID === nodeid && tsk.Status.State === 'running').pop()
        if (tsk) {
          return redirectServiceUrl(proxyServiceName + '.' + tsk.NodeID + '.' + tsk.ID + ':' + proxyServicePort)
        } else {
          console.log('Cannot find proxy service for', nodeid, 'at', proxyUrl)
        }
      } else {
        console.log('Cannot process proxy services at', proxyUrl)
      }
    })
}

router.use('/api/system/:nodeid', (req, res) => {
  return getDockerApiEndpointForNode(req.params.nodeid)
    .then(dockerProxyHost => getSystemInfo(dockerProxyHost))
    .then(j => res.status(200).send(j))
    .catch(ex => {
      console.log('Failed to get system details: ', ex)
      if (ex instanceof HttpError) {
        res.status(ex.statusCode).send(ex.message)
      } else {
        res.status(500).send('Unable to get container details')
      }
    })
})

router.use('/api/container/:nodeid/:taskid', (req, res) => {
  return getDockerApiEndpointForNode(req.params.nodeid)
    .then(dockerProxyHost => getContainerDetails(dockerProxyHost, req.params.taskid))
    .then(j => res.status(200).send(j))
    .catch(ex => {
      console.log('Failed to get container details: ', ex)
      if (ex instanceof HttpError) {
        res.status(ex.statusCode).send(ex.message)
      } else {
        res.status(500).send('Unable to get container details')
      }
    })
})

const permittedStandardLabels = new Set()
permittedStandardLabels.add("com_docker_stack_namespace")
permittedStandardLabels.add("com_docker_swarm_service_name")

function buildStandardLabels(node, container) {
  let labels = 'ctr_node="' + node.Description?.Hostname + '"'
    + ',ctr_nodeid="' + node.ID + '"';
  if (container.Labels) {
    for (let [key, value] of Object.entries(container.Labels)) {
      key = key.toLowerCase().replace(/[\s,=\.]+/g, '_').replace(/"/g, '')
      if (permittedStandardLabels.has(key)) {
        value = value.replace(/"/g, '')
        labels = labels + ',ctr_label_' + key + '="' + value + '"' 
      }
    }
  }
  return labels
}

function getContainerStats(endpoint, containerId, startTime, node, container, stats) {
  return fetch('http://' + endpoint + '/v1.45/containers/' + containerId + '/stats?stream=false&one-shot=true')
    .then(r => r.json())
    .then(cs => {
      // console.log('Time to get stats for ' + containerId + ' from ' + endpoint + ': ' + (performance.now() - startTime))
      let standardLabels = buildStandardLabels(node, container)

      if (cs['blkio_stats']) {
        if (cs['blkio_stats']['io_service_bytes_recursive']) {
          cs['blkio_stats']['io_service_bytes_recursive'].forEach(iosb => {
            let key = 'ctr_blkio_stats_io_service_bytes_recursive_' + iosb['op'].toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + ',ctr_blkio_stats_device="' + iosb['major'] + ':' + iosb['minor'] +'"' + '}="' + iosb['value'] + '"')
            }
          })
        }
        if (cs['blkio_stats']['io_service_recursive']) {
          cs['blkio_stats']['io_service_recursive'].forEach(iosb => {
            let key = 'ctr_blkio_stats_io_service_recursive_' + iosb['op'].toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + ',ctr_blkio_stats_device="' + iosb['major'] + ':' + iosb['minor'] +'"' + '}="' + iosb['value'] + '"')
            }
          })
        }
      }
      if (cs['cpu_stats']) {
        let cpuStats = cs['cpu_stats']
        if (cpuStats['cpu_usage']) {
          let cpuUsage = cpuStats['cpu_usage']
          stats['ctr_cpu_usage_total'].push('ctr_cpu_usage_total{' + standardLabels + '}=' + cpuUsage['total_usage'])
          stats['ctr_cpu_usage_kernelmode'].push('ctr_cpu_usage_kernelmode{' + standardLabels + '}=' + cpuUsage['usage_in_kernelmode'])
          stats['ctr_cpu_usage_usermode'].push('ctr_cpu_usage_usermode{' + standardLabels + '}=' + cpuUsage['usage_in_usermode'])
          if (cpuUsage['percpu_usage']) {
            let perCpuUsage = cpuUsage['percpu_usage']
            for (let i = 0; i < perCpuUsage.length; i++) {
              stats['ctr_cpu_usage_percpu'].push('ctr_cpu_usage_percpu{' + standardLabels + ',cpu="' + i.toString().padStart(2, '0') + '}=' + perCpuUsage[i])
            }
          }
        }
      }
      if (cs['memory_stats']) {
        let memStats = cs['memory_stats']
        stats['ctr_memory_usage'].push('ctr_memory_usage{' + standardLabels + '}=' + memStats['usage'])
        stats['ctr_memory_limit'].push('ctr_memory_limit{' + standardLabels + '}=' + memStats['usage'])
        stats['ctr_memory_max_usage'].push('ctr_memory_max_usage{' + standardLabels + '}=' + memStats['max_usage'])
        if (memStats['stats']) {
          Object.entries(memStats['stats']).forEach(([stat, value]) => {
            let key = 'ctr_memory_stats_' + stat.toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + '}="' + value + '"')
            }
          })
        }
      }
      if (cs['networks']) {
        Object.entries(cs['networks']).forEach(([iface, ifaceStats]) => {
          Object.entries(ifaceStats).forEach(([stat, value]) => {
            let key = 'ctr_network_usage_' + stat.toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + ',iface="' + iface + '"}="' + value + '"')
            }
          })
        })
      }
    })
}

function getContainersStats(endpoint, startTime, node, stats) {
  return fetch('http://' + endpoint + '/v1.45/containers/json')
    .then(r => r.json())
    .then(containers => {
      console.log('Time to get containers from ' + endpoint + ': ' + (performance.now() - startTime))
      const promises = []
      if (Array.isArray(containers)) {
        containers.forEach(container => {
          promises.push(getContainerStats(endpoint, container.Id, startTime, node, container, stats))
        })
        return Promise.all(promises)
      }
    })
}

function getMetrics(serviceProxiesUrl, proxyServiceName, proxyServicePort, startTime, nodes, stats) {
  return fetch(serviceProxiesUrl)
    .then(r => r.json())
    .then(dockerProxyTasks => {
      console.log('Time to get docker proxy tasks from ' + serviceProxiesUrl + ': ' + (performance.now() - startTime))
      const promises = []
      if (Array.isArray(dockerProxyTasks)) {
        dockerProxyTasks.forEach(dockerProxyTask => {
          if (dockerProxyTask.ID && dockerProxyTask.NodeID && dockerProxyTask.Status.State === 'running') {
            let node = nodes.find(n => n.ID === dockerProxyTask.NodeID);
            let dockerProxyEndpoint = redirectServiceUrl(proxyServiceName + '.' + dockerProxyTask.NodeID + '.' + dockerProxyTask.ID + ':' + proxyServicePort)
            promises.push(getContainersStats(dockerProxyEndpoint, startTime, node, stats))
          }
        })
        return Promise.all(promises)
      }
    })
}

router.use('/metrics', (req, res) => {
  let start = performance.now()
  let stats = {
    'ctr_blkio_stats_io_service_bytes_recursive_read': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_read count of bytes read by the container'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_read counter'
    ]
    , 'ctr_blkio_stats_io_service_bytes_recursive_write': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_write count of bytes written by the container'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_write counter'
    ]
    , 'ctr_blkio_stats_io_service_bytes_recursive_sync': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_sync count of bytes read or written by the container synchronously'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_sync counter'
    ]
    , 'ctr_blkio_stats_io_service_bytes_recursive_async': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_async count of bytes read or written by the container asynchronously'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_async counter'
    ]
    , 'ctr_blkio_stats_io_service_bytes_recursive_discard': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_discard count of I/O bytes discarded by the container'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_discard counter'
    ]
    , 'ctr_blkio_stats_io_service_bytes_recursive_total': [
      '# HELP ctr_blkio_stats_io_service_bytes_recursive_total count of I/O bytes by the container'
      , '# TYPE ctr_blkio_stats_io_service_bytes_recursive_total counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_read': [
      '# HELP ctr_blkio_stats_io_service_recursive_read count of reads by the container'
      , '# TYPE ctr_blkio_stats_io_service_recursive_read counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_write': [
      '# HELP ctr_blkio_stats_io_service_recursive_write count of writes by the container'
      , '# TYPE ctr_blkio_stats_io_service_recursive_write counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_sync': [
      '# HELP ctr_blkio_stats_io_service_recursive_sync count of synchronous I/O operations by the container'
      , '# TYPE ctr_blkio_stats_io_service_recursive_sync counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_async': [
      '# HELP ctr_blkio_stats_io_service_recursive_async count of asynchronous I/O operations by the container'
      , '# TYPE ctr_blkio_stats_io_service_recursive_async counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_discard': [
      '# HELP ctr_blkio_stats_io_service_recursive_discard count of I/O operations by the container that were discarded'
      , '# TYPE ctr_blkio_stats_io_service_recursive_discard counter'
    ]
    , 'ctr_blkio_stats_io_service_recursive_total': [
      '# HELP ctr_blkio_stats_io_service_recursive_total count of I/O operations by the container'
      , '# TYPE ctr_blkio_stats_io_service_recursive_total counter'
    ]

    , 'ctr_cpu_usage_total': [
      '# HELP ctr_cpu_usage_total total CPU time used by the container'
      , '# TYPE ctr_cpu_usage_total counter'
    ]
    , 'ctr_cpu_usage_kernelmode': [
      '# HELP ctr_cpu_usage_kernelmode CPU time in kernel mode used by the container'
      , '# TYPE ctr_cpu_usage_kernelmode counter'
    ]
    , 'ctr_cpu_usage_usermode': [
      '# HELP ctr_cpu_usage_usermode CPU time in user mode used by the container'
      , '# TYPE ctr_cpu_usage_usermode counter'
    ]
    , 'ctr_cpu_usage_percpu': [
      '# HELP ctr_cpu_usage_percpu CPU time used by the container on each CPU'
      , '# TYPE ctr_cpu_usage_percpu counter'
    ]

    , 'ctr_memory_usage': [
      '# HELP ctr_memory_usage Memory used by the container (excludes page cache usage)'
      , '# TYPE ctr_memory_usage guage'
    ]

    , 'ctr_memory_limit': [
      '# HELP ctr_memory_limit Memory usage limit of the container, in bytes'
      , '# TYPE ctr_memory_limit guage'
    ]

    , 'ctr_memory_max_usage': [
      '# HELP ctr_memory_max_usage Maximum measured memory usage of the container, in bytes'
      , '# TYPE ctr_memory_max_usage guage'
    ]

    , 'ctr_memory_stats_active_anon': [
      '# HELP ctr_memory_stats_active_anon Amount of memory that has been identified as active by the kernel. Anonymous memory is memory that is not linked to disk pages.'
      , '# TYPE ctr_memory_stats_active_anon guage'
    ]

    , 'ctr_memory_stats_active_file': [
      '# HELP ctr_memory_stats_active_file Amount of active file cache memory. Cache memory = active_file + inactive_file + tmpfs'
      , '# TYPE ctr_memory_stats_active_file guage'
    ]

    , 'ctr_memory_stats_cache': [
      '# HELP ctr_memory_stats_cache The amount of memory used by the processes of this control group that can be associated with a block on a block device. Also accounts for memory used by tmpfs.'
      , '# TYPE ctr_memory_stats_cache guage'
    ]

    , 'ctr_memory_stats_dirty': [
      '# HELP ctr_memory_stats_dirty The amount of memory waiting to get written to disk'
      , '# TYPE ctr_memory_stats_dirty guage'
    ]

    , 'ctr_memory_stats_hierarchical_memory_limit': [
      '# HELP ctr_memory_stats_hierarchical_memory_limit The memory limit in place by the hierarchy cgroup'
      , '# TYPE ctr_memory_stats_hierarchical_memory_limit guage'
    ]

    , 'ctr_memory_stats_hierarchical_memsw_limit': [
      '# HELP ctr_memory_stats_hierarchical_memsw_limit The memory+swap limit in place by the hierarchy cgroup'
      , '# TYPE ctr_memory_stats_hierarchical_memsw_limit guage'
    ]

    , 'ctr_memory_stats_inactive_anon': [
      '# HELP ctr_memory_stats_inactive_anon Amount of memory that has been identified as inactive by the kernel. Anonymous memory is memory that is not linked to disk pages.'
      , '# TYPE ctr_memory_stats_inactive_anon guage'
    ]

    , 'ctr_memory_stats_inactive_file': [
      '# HELP ctr_memory_stats_inactive_file Amount of inactive file cache memory. Cache memory = active_file + inactive_file + tmpfs'
      , '# TYPE ctr_memory_stats_inactive_file guage'
    ]
    , 'ctr_memory_stats_mapped_file': [
      '# HELP ctr_memory_stats_mapped_file Indicates the amount of memory mapped by the processes in the control group. It doesn’t give you information about how much memory is used; it rather tells you how it is used.'
      , '# TYPE ctr_memory_stats_mapped_file guage'
    ]
    , 'ctr_memory_stats_pgfault': [
      '# HELP ctr_memory_stats_pgfault (cumulative) Number of times that a process of the cgroup triggered a page fault. Page faults occur when a process accesses part of its virtual memory space which is nonexistent or protected. See https://docs.docker.com/config/containers/runmetrics for more info.'
      , '# TYPE ctr_memory_stats_pgfault counter'
    ]
    , 'ctr_memory_stats_pgmajfault': [
      '# HELP ctr_memory_stats_pgmajfault (cumulative) Number of times that a process of the cgroup triggered a major page fault. Page faults occur when a process accesses part of its virtual memory space which is nonexistent or protected. See https://docs.docker.com/config/containers/runmetrics for more info.'
      , '# TYPE ctr_memory_stats_pgmajfault counter'
    ]
    , 'ctr_memory_stats_pgpgin': [
      '# HELP ctr_memory_stats_pgpgin (cumulative) Number of charging events to the memory cgroup. Charging events happen each time a page is accounted as either mapped anon page(RSS) or cache page to the cgroup.'
      , '# TYPE ctr_memory_stats_pgpgin counter'
    ]
    , 'ctr_memory_stats_pgpgout': [
      '# HELP ctr_memory_stats_pgpgout (cumulative) Number of uncharging events to the memory cgroup. Uncharging events happen each time a page is unaccounted from the cgroup.'
      , '# TYPE ctr_memory_stats_pgpgout counter'
    ]
    , 'ctr_memory_stats_rss': [
      '# HELP ctr_memory_stats_rss The amount of memory that doesn’t correspond to anything on disk: stacks, heaps, and anonymous memory maps.'
      , '# TYPE ctr_memory_stats_rss guage'
    ]
    , 'ctr_memory_stats_rss_huge': [
      '# HELP ctr_memory_stats_rss_huge Amount of memory due to anonymous transparent hugepages.'
      , '# TYPE ctr_memory_stats_rss_huge guage'
    ]
    , 'ctr_memory_stats_shmem': [
      '# HELP ctr_memory_stats_shmem Amount of Shared Memory used by the container, in bytes.'
      , '# TYPE ctr_memory_stats_shmem guage'
    ]
    , 'ctr_memory_stats_swap': [
      '# HELP ctr_memory_stats_swap Bytes of swap memory used by container'
      , '# TYPE ctr_memory_stats_swap guage'
    ]
    , 'ctr_memory_stats_unevictable': [
      '# HELP ctr_memory_stats_unevictable The amount of memory that cannot be reclaimed.'
      , '# TYPE ctr_memory_stats_unevictable guage'
    ]
    , 'ctr_memory_stats_writeback': [
      '# HELP ctr_memory_stats_writeback The amount of memory from file/anon cache that are queued for syncing to the disk'
      , '# TYPE ctr_memory_stats_writeback guage'
    ]
    , 'ctr_network_usage_rx_bytes': [
      '# HELP ctr_network_usage_rx_bytes Bytes received by the container via its network interface'
      , '# TYPE ctr_network_usage_rx_bytes guage'
    ]
    , 'ctr_network_usage_rx_dropped': [
      '# HELP ctr_network_usage_rx_dropped Number of inbound network packets dropped by the container'
      , '# TYPE ctr_network_usage_rx_dropped guage'
    ]
    , 'ctr_network_usage_rx_errors': [
      '# HELP ctr_network_usage_rx_errors Errors receiving network packets'
      , '# TYPE ctr_network_usage_rx_errors guage'
    ]
    , 'ctr_network_usage_rx_packets': [
      '# HELP ctr_network_usage_rx_packets Network packets received by the container via its network interface'
      , '# TYPE ctr_network_usage_rx_packets guage'
    ]
    , 'ctr_network_usage_tx_bytes': [
      '# HELP ctr_network_usage_tx_bytes Bytes sent by the container via its network interface'
      , '# TYPE ctr_network_usage_tx_bytes guage'
    ]
    , 'ctr_network_usage_tx_dropped': [
      '# HELP ctr_network_usage_tx_dropped Number of outbound network packets dropped by the container'
      , '# TYPE ctr_network_usage_tx_dropped guage'
    ]
    , 'ctr_network_usage_tx_errors': [
      '# HELP ctr_network_usage_tx_errors Errors sending network packets'
      , '# TYPE ctr_network_usage_tx_errors guage'
    ]
    , 'ctr_network_usage_tx_packets': [
      '# HELP ctr_network_usage_tx_packets Network packets sent by the container via its network interface'
      , '# TYPE ctr_network_usage_tx_packets guage'
    ]
  }

  const promises = []
  fetch('http://' + endpoint + '/v1.45/nodes')
    .then(r => r.json())
    .then(nodes => {
      promises.push(getMetrics(serviceProxiesUrl, service, service_port, start, nodes, stats))
      if (workersServiceProxiesUrl) {
        promises.push(getMetrics(workersServiceProxiesUrl, workers_service, workers_service_port, start, nodes, stats))
      }
    
      Promise.all(promises)
          .then(results => {
            console.log('Time to get stats: ' + (performance.now() - start))
            res.set('Content-Type', 'text/plain; version=0.0.4');
            res.status(200)
            Object.values(stats).forEach(stat => {
              console.log(stat[1])
              stat.forEach(line => {
                res.write(line)
                res.write('\n')
              })
            })
            res.end()
          })
          .catch(ex => {
            console.log('Failed to get metrics: ', ex)
            if (ex instanceof HttpError) {
              res.status(ex.statusCode).send(ex.message)
            } else {
              res.status(500).send('Unable to get metrics')
            }
          })      
    })
    .catch(ex => {
      console.log('Failed to get nodes: ', ex)
      if (ex instanceof HttpError) {
        res.status(ex.statusCode).send(ex.message)
      } else {
        res.status(500).send('Unable to get metrics')
      }
    })      
})

export default router;
