import { Config, ContainerInspectData, ContainerTopData, Network, Node, Secret, Service, SystemInfo, Task } from "./docker-schema";

class Cache {
  lastUpdate: Date = new Date()

  configs: Config[] | undefined
  networks: Network[] | undefined
  nodes: Node[] | undefined
  secrets: Secret[] | undefined
  services: Service[] | undefined
  tasks: Task[] | undefined

  servicesById: Map<string, Service> | undefined
  nodesById: Map<string, Service> | undefined

  exposedPorts: Record<string, string[]> | undefined  

  systems: Record<string, SystemInfo> | undefined
  containers: Record<string, Record<string, ContainerData>> | undefined
}

export interface ContainerData {
  container?: ContainerInspectData
  , top?: ContainerTopData
}

export class DockerApi {
  baseUrl: string
  private cache: Cache
  errorCallback: (err : string) => void

  constructor(baseUrl: string, errorCallback: (err : string) => void) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : (baseUrl + '/')
    this.cache = new Cache()
    this.errorCallback = errorCallback
  }

  private get<Type>(path: string, type: string, queryString?: string): Promise<Type> {
    const url = this.baseUrl + path + (queryString ? ('?' + queryString) : '')
    console.log('Getting ' + url)
    return fetch(url)
      .then(r => {
        if (r.ok) {
          return r.json();
        } else {
          console.log('Fetch failed: ', r)
          return r.text().then(t => {
            console.log(t)
            throw new Error('Failed to get ' + type + ':  (' + String(r.status) + ') ' + t)
          })
        }
      })
      .then(j => {
        const conf = j as Type
        console.log('Got ' + type, conf)
        return conf
      })
      .catch(reason => {
        console.log('Failed to get ' + type + ':  ', reason)
        if (this.errorCallback) {
          this.errorCallback('Failed to get ' + type + ':  ' + String(reason))
        }
        throw reason
      })
  }

  private getAll<Type>(path: string, type: string, queryString?: string): Promise<Type[]> {
    return this.get<Type[]>('docker/v1.45/' + path, type, queryString)
  }

  clearCache() {
    this.cache = new Cache()
    console.log('New cache ', this.cache.lastUpdate)
  }

  lastUpdated(): Date {
    return this.cache.lastUpdate
  }

  config(id: string | undefined): Promise<Config | undefined> {
    return this.configs()
      .then(cfgs => {
        return cfgs.find(cfg => cfg.ID === id)
      })
  }

  configs(): Promise<Config[]> {
    if (this.cache.configs !== undefined) {
      return Promise.resolve(this.cache.configs)
    } else {
      return this.getAll<Secret>('configs', 'configs')
        .then(cnfs => {
          this.cache.configs = cnfs
          return cnfs
        })
        .catch(_ => {
          return this.cache.configs = []
        })
    }
  }

  networks(): Promise<Network[]> {
    if (this.cache.networks !== undefined) {
      return Promise.resolve(this.cache.networks)
    } else {
      return this.getAll<Network>('networks', 'networks')
        .then(nets => {
          this.cache.networks = nets
          return nets
        })
        .catch(_ => {
          return this.cache.networks = []
        })
    }
  }

  nodes(): Promise<Node[]> {
    if (this.cache.nodes !== undefined) {
      return Promise.resolve(this.cache.nodes)
    } else {
      return this.getAll<Node>('nodes', 'nodes')
        .then(nods => {
          this.cache.nodes = nods
          return nods
        })
        .catch(_ => {
          return this.cache.nodes = []
        })
    }
  }

  nodesById(): Promise<Map<string, Node>> {
    if (this.cache.nodesById !== undefined) {
      return Promise.resolve(this.cache.nodesById)
    } else {
      return this.nodes()
        .then(nods => {
          this.cache.nodesById = nods.reduce((result, current) => {
            if (current.ID) {
              result.set(current.ID, current)
            }
            return result
          }, new Map<string, Node>())
          return this.cache.nodesById
        })
    }
  }

  secret(id: string | undefined): Promise<Secret | undefined> {
    return this.secrets()
      .then(secs => {
        return secs.find(sec => sec.ID === id)
      })
  }

  secrets(): Promise<Secret[]> {
    if (this.cache.secrets !== undefined) {
      return Promise.resolve(this.cache.secrets)
    } else {
      return this.getAll<Secret>('secrets', 'secrets')
        .then(secs => {
          this.cache.secrets = secs
          return secs
        })
        .catch(_ => {
          return this.cache.secrets = []
        })
    }
  }

  services(): Promise<Service[]> {
    if (this.cache.services !== undefined) {
      return Promise.resolve(this.cache.services)
    } else {
      return this.getAll<Service>('services', 'services', 'status=true')
        .then(svcs => {
          this.cache.services = svcs
          return svcs
        })
        .catch(_ => {
          return this.cache.services = []
        })
    }
  }

  servicesById(): Promise<Map<string, Service>> {
    if (this.cache.servicesById !== undefined) {
      return Promise.resolve(this.cache.servicesById)
    } else {
      return this.services()
        .then(svcs => {
          this.cache.servicesById = svcs.reduce((result, current) => {
            if (current.ID) {
              result.set(current.ID, current)
            }
            return result
          }, new Map<string, Service>())
          return this.cache.servicesById
        })
    }
  }

  task(id: string | undefined): Promise<Task | undefined> {
    return this.tasks()
      .then(tsks => {
        return tsks.find(tsk => tsk.ID === id)
      })
  }

  tasks(): Promise<Task[]> {
    if (this.cache.tasks !== undefined) {
      return Promise.resolve(this.cache.tasks)
    } else {
      return this.getAll<Task>('tasks', 'tasks')
        .then(tsks => {
          this.cache.tasks = tsks
          return tsks
        })
        .catch(_ => {
          return this.cache.tasks = []
        })

    }
  }

  exposedPorts(): Promise<Record<string, string[]>> {
    if (this.cache.exposedPorts !== undefined) {
      return Promise.resolve(this.cache.exposedPorts)
    } else {
      return this.get<Record<string, string[]>>('api/exposed', 'exposed ports')
        .then(ports => {
          this.cache.exposedPorts = ports
          return ports
        })
        .catch(_ => {
          return this.cache.exposedPorts = {}
        })
    }
  }

  container(nodeId: string, taskId: string) : Promise<ContainerData> {
    if (this.cache.containers && this.cache.containers[nodeId] && this.cache.containers[nodeId][taskId]) {
      return Promise.resolve(this.cache.containers[nodeId][taskId])
    } else {
      return this.get<ContainerData>('api/container/' + nodeId + '/' + taskId, 'container')
        .then(ctr => {
          if (!this.cache.containers) {
            this.cache.containers = {}
          }
          if (!this.cache.containers[nodeId]) {
            this.cache.containers[nodeId] = {}
          }
          this.cache.containers[nodeId][taskId] = ctr
          return ctr
        })
        .catch(_ => {
          if (this.cache.containers && this.cache.containers[nodeId] && this.cache.containers[nodeId][taskId]) {
            return this.cache.containers[nodeId][taskId] = {} as ContainerData
          } else {
            return {} as ContainerData
          }
        })
    }
  }

  system(nodeId: string) {
    if (this.cache.systems && this.cache.systems[nodeId]) {
      return Promise.resolve(this.cache.systems[nodeId])
    } else {
      return this.get<SystemInfo>('api/system/' + nodeId, 'system')
        .then(sys => {
          if (!this.cache.systems) {
            this.cache.systems = {}
          }
          if (!this.cache.systems[nodeId]) {
            this.cache.systems[nodeId] = sys
          }
          return sys
        })
        .catch(_ => {
          if (this.cache.systems && this.cache.systems[nodeId]) {
            return this.cache.systems[nodeId] = {}
          }
        })
    }
  }

}