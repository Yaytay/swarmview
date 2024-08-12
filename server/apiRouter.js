import express from "express";
import proxy from "express-http-proxy"
import 'dotenv/config'

const router = express.Router();

const endpoint = process.env.DOCKER_PROXY_ENDPOINT || 'dockerproxy:2375'

if (!process.env.DOCKER_PROXY_ENDPOINT) {
  console.log('Set the environment variable DOCKER_PROXY_ENDPOINT to configure the primary docker endpoint')
}

const service = process.env.DOCKER_PROXY_SERVICE
const service_port = process.env.DOCKER_PROXY_SERVICE_PORT || '2375'
const service_redirect = JSON.parse(process.env.DOCKER_PROXY_SERVICE_REDIRECT || '{}')

if (!process.env.DOCKER_PROXY_SERVICE) {
  console.log('Set the environment variable DOCKER_PROXY_SERVICE to enable dynamic discovery of docker services.\n'
    + 'This is only used for functionality that requires access to all nodes (such as port exposure).\n'
    + 'This can only work when running inside a swarm.\n'
  )
}

const serviceProxiesUrl = 'http://' + endpoint + '/v1.45/tasks?filters={%22name%22:[%22' + service + '%22],%22desired-state%22:[%22running%22]}'

router.use('/docker', proxy(endpoint, {
  filter: (req, res) => {
    console.log('Request to ' + req.url)
    return req.method === 'GET'
  }
}))

// Get all the exports for one image
function getExportsForImage(result, url) {
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      if (j.Config.ExposedPorts && Array.isArray(j.RepoDigests)) {
        j.RepoDigests.forEach(digest => {
          // console.log('At ' + url + ' for ' + digest + ' got: ', j.Config.ExposedPorts)
          result[digest] = Object.keys(j.Config.ExposedPorts)
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
        console.log('Found ' + j.length + ' images at ' + url)
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

// Get all the exports known to any of the hosts running the docker proxy
function getExportsFromAllDockerProxies(result, url) {
  return fetch(url)
    .then(r => r.json())
    .then(j => {
      const promises = []
      if (Array.isArray(j)) {
        j.forEach(tsk => {
          if (tsk.ID && tsk.NodeID && tsk.Status.State === 'running') {
            let dockerProxyHost = service + '.' + tsk.NodeID + '.' + tsk.ID + ':' + service_port
            if (service_redirect && service_redirect[dockerProxyHost]) {
              console.log('Using ' + service_redirect[dockerProxyHost] + ' instead of ' + dockerProxyHost)
              dockerProxyHost = service_redirect[dockerProxyHost]
            }
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
  getExportsFromAllDockerProxies(result, serviceProxiesUrl)
    .then(_ => {
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
function getUrlForNode(nodeid) {
  if (!service) {
    return Promise.reject(new HttpError(404, 'Not configured for node-based data'))
  }
  return fetch(serviceProxiesUrl)
    .then(r => r.json())
    .then(j => {
      if (Array.isArray(j)) {
        const tsk = j.filter(tsk => tsk.NodeID === nodeid && tsk.Status.State === 'running').pop()
        if (tsk) {
          let dockerProxyHost = service + '.' + tsk.NodeID + '.' + tsk.ID + ':' + service_port
          //console.log(dockerProxyHost)
          //console.log(service_redirect)
          if (service_redirect && service_redirect[dockerProxyHost]) {
            console.log('Using ' + service_redirect[dockerProxyHost] + ' instead of ' + dockerProxyHost)
            dockerProxyHost = service_redirect[dockerProxyHost]
          }
          return dockerProxyHost
        } else {
          throw new HttpError(404, 'Cannot find proxy service for ' + req.params.node)
        }
      } else {
        throw new HttpError(404, 'Cannot process proxy services')
      }
    })
}

router.use('/api/system/:nodeid', (req, res) => {
  return getUrlForNode(req.params.nodeid)
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
  return getUrlForNode(req.params.nodeid)
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

export default router;
