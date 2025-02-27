import express from "express";
import proxy from "express-http-proxy"
import { performance } from "node:perf_hooks";
import 'dotenv/config'
import { newStats } from './docker-stats.js'

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
const prometheus_api_endpoint = process.env.PROMETHEUS_API_ENDPOINT

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

if (prometheus_api_endpoint) {
  router.use('/prometheus', proxy(prometheus_api_endpoint, {
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
}

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

router.use('/api/prometheus', (_, res) => {
  if (prometheus_api_endpoint) {


    res.status(200).send(prometheus_api_endpoint)
  } else {
    res.status(404).send('Not configured for prometheus')
  }
})

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
  // console.log(proxyUrl)
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
permittedStandardLabels.add("com_docker_swarm_service_id")
permittedStandardLabels.add("com_docker_swarm_service_name")
permittedStandardLabels.add("com_docker_swarm_task_id")
permittedStandardLabels.add("com_docker_swarm_task_name")

function buildStandardLabels(node, container) {
  let labels = 'ctr_node="' + node.Description?.Hostname + '"'
    + ',ctr_nodeid="' + node.ID + '"'
    + ',ctr_image="' + container.Image + '"'
    ;
  if (container.Names) {
    labels += ',ctr_name="' + container.Names[0] + '"'
  } else if (container.Name) {
    labels += ',ctr_name="' + container.Name + '"'
  }

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
              stats[key].push(key + '{' + standardLabels + ',ctr_blkio_stats_device="' + iosb['major'] + ':' + iosb['minor'] +'"' + '} ' + iosb['value'])
            }
          })
        }
        if (cs['blkio_stats']['io_service_recursive']) {
          cs['blkio_stats']['io_service_recursive'].forEach(iosb => {
            let key = 'ctr_blkio_stats_io_service_recursive_' + iosb['op'].toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + ',ctr_blkio_stats_device="' + iosb['major'] + ':' + iosb['minor'] +'"' + '} ' + iosb['value'])
            }
          })
        }
      }
      if (cs['cpu_stats']) {
        let cpuStats = cs['cpu_stats']
        if (cpuStats['cpu_usage']) {
          let cpuUsage = cpuStats['cpu_usage']
          if (cpuUsage['total_usage']) {
            stats['ctr_cpu_usage_total'].push('ctr_cpu_usage_total{' + standardLabels + '} ' + (cpuUsage['total_usage'] / 1000000000.0))
          }
          if (cpuUsage['usage_in_kernelmode']) {
            stats['ctr_cpu_usage_kernelmode'].push('ctr_cpu_usage_kernelmode{' + standardLabels + '} ' + (cpuUsage['usage_in_kernelmode'] / 1000000000.0))
          }
          if (cpuUsage['usage_in_usermode']) {
            stats['ctr_cpu_usage_usermode'].push('ctr_cpu_usage_usermode{' + standardLabels + '} ' + (cpuUsage['usage_in_usermode'] / 1000000000.0))
          }
          if (cpuUsage['percpu_usage']) {
            let perCpuUsage = cpuUsage['percpu_usage']
            for (let i = 0; i < perCpuUsage.length; i++) {
              stats['ctr_cpu_usage_percpu'].push('ctr_cpu_usage_percpu{' + standardLabels + ',cpu="' + i.toString().padStart(2, '0') + '} ' + (perCpuUsage[i] / 1000000000.0))
            }
          }
        }
      }
      if (cs['memory_stats']) {
        let memStats = cs['memory_stats']
        if (memStats['usage']) {
          stats['ctr_memory_usage'].push('ctr_memory_usage{' + standardLabels + '} ' + memStats['usage'])
        }
        if (memStats['limit']) {
          stats['ctr_memory_limit'].push('ctr_memory_limit{' + standardLabels + '} ' + memStats['limit'])
        }
        if (memStats['max_usage']) {
          stats['ctr_memory_max_usage'].push('ctr_memory_max_usage{' + standardLabels + '} ' + memStats['max_usage'])
        }
        if (memStats['stats']) {
          Object.entries(memStats['stats']).forEach(([stat, value]) => {
            let key = 'ctr_memory_stats_' + stat.toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + '} ' + value)
            }
          })
        }
      }
      if (cs['networks']) {
        Object.entries(cs['networks']).forEach(([iface, ifaceStats]) => {
          Object.entries(ifaceStats).forEach(([stat, value]) => {
            let key = 'ctr_network_usage_' + stat.toLowerCase()
            if (stats.hasOwnProperty(key)) {
              stats[key].push(key + '{' + standardLabels + ',iface="' + iface + '"} ' + value)
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
      // console.log('Time to get containers from ' + endpoint + ': ' + (performance.now() - startTime))
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
      // console.log('Time to get docker proxy tasks from ' + serviceProxiesUrl + ': ' + (performance.now() - startTime))
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
  let stats = newStats()

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
            // console.log('Time to get stats: ' + (performance.now() - start))
            res.set('Content-Type', 'text/plain; version=0.0.4');
            res.status(200)
            Object.values(stats).forEach(stat => {
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
