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
const service_redirect = JSON.parse(process.env.DOCKER_PROXY_SERVICE_REDIRECT || '{}' )

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
          console.log('At ' + url + ' for ' + digest + ' got: ', j.Config.ExposedPorts)
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
    .catch(ex => {
      console.log('Failed to get ' + url + ': ', ex)
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

router.use('/api/system/:node', (req, res) => {
  //console.log(req.params.node)
  if (!service) {
    res.status(404).send('Not configured for system data')
  }

  return fetch(serviceProxiesUrl)
    .then(r => r.json())
    .then(j => {
      if (Array.isArray(j)) {
        const tsk = j.filter(tsk => tsk.NodeID === req.params.node && tsk.Status.State === 'running').pop()
        if (tsk) {
          let dockerProxyHost = service + '.' + tsk.NodeID + '.' + tsk.ID + ':' + service_port
          //console.log(dockerProxyHost)
          //console.log(service_redirect)
          if (service_redirect && service_redirect[dockerProxyHost]) {
            console.log('Using ' + service_redirect[dockerProxyHost] + ' instead of ' + dockerProxyHost)
            dockerProxyHost = service_redirect[dockerProxyHost]
          }
          getSystemInfo(dockerProxyHost)
            .then(j => res.status(200).send(j))
        } else {
          res.status(404).send('Cannot find system info ' + req.params.node)
        }
      } else {
        res.status(404).send('Cannot process proxies')
      }
    })
    .catch(ex => {
      console.log('Failed to get ' + serviceProxiesUrl + ': ', ex)
    })
})

export default router;
