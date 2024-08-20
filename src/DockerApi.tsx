import { Config, Network, Node, Secret, Service, Task } from "./docker-schema";

class Cache {
  lastUpdate: Date = new Date()

  configs: Config[] | undefined
  networks: Network[] | undefined
  nodes: Node[] | undefined
  secrets: Secret[] | undefined
  services: Service[] | undefined
  tasks: Task[] | undefined
}

export class DockerApi {
  baseUrl: string
  cache: Cache

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.cache = new Cache()
  }

  private getAll<Type>(path: string, type: string, queryString?: string): Promise<Type[]> {
    return fetch(this.baseUrl + path + (queryString ? ('?' + queryString) : ''))
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .then(j => {
        const conf = j as Type[]
        console.log('Got ' + type, conf)
        return conf
      })
      .catch(reason => {
        console.log('Failed to get ' + type + 's:  ', reason)
        throw reason
      })
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
    if (this.cache.configs) {
      return Promise.resolve(this.cache.configs)
    } else {
      return this.getAll<Secret>('configs', 'configs')
        .then(cnfs => {
          this.cache.configs = cnfs
          return cnfs
        })
    }
  }

  networks(): Promise<Network[]> {
    if (this.cache.networks) {
      return Promise.resolve(this.cache.networks)
    } else {
      return this.getAll<Network>('networks', 'networks')
        .then(nets => {
          this.cache.networks = nets
          return nets
        })
    }
  }

  nodes(): Promise<Node[]> {
    if (this.cache.nodes) {
      return Promise.resolve(this.cache.nodes)
    } else {
      return this.getAll<Node>('nodes', 'nodes')
        .then(nods => {
          this.cache.nodes = nods
          return nods
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
    if (this.cache.secrets) {
      return Promise.resolve(this.cache.secrets)
    } else {
      return this.getAll<Secret>('secrets', 'secrets')
        .then(secs => {
          this.cache.secrets = secs
          return secs
        })
    }
  }

  services(): Promise<Service[]> {
    if (this.cache.services) {
      return Promise.resolve(this.cache.services)
    } else {
      return this.getAll<Service>('services', 'services', 'status=true')
        .then(svcs => {
          this.cache.services = svcs
          return svcs
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
    if (this.cache.tasks) {
      return Promise.resolve(this.cache.tasks)
    } else {
      return this.getAll<Task>('tasks', 'tasks')
        .then(tsks => {
          this.cache.tasks = tsks
          return tsks
        })

    }
  }

}