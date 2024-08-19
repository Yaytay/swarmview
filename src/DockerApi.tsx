import { Config, Network, Node, Secret, Service, Task } from "./docker-schema";

class Cache {
  configs: Config[] | undefined
  networks: Network[] | undefined
  nodes: Node[] | undefined
  secrets: Secret[] | undefined
  services: Service[] | undefined
  tasks: Task[] | undefined

  clear() {
    this.configs = undefined
    this.networks = undefined
    this.nodes = undefined
    this.secrets = undefined
    this.services = undefined
    this.tasks = undefined
  }
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
        return conf
      })
      .catch(reason => {
        console.log('Failed to get ' + type + 's:  ', reason)
        throw reason
      })
  }

  clearCache() {
    this.cache.clear()
  }

  config(id: string | undefined): Promise<Config | undefined> {
    return this.configs()
      .then(cfgs => {
        return cfgs.find(cfg => cfg.ID === id)
      })
  }

  configs(): Promise<Config[]> {
    return this.getAll<Config>('configs', 'configs')
  }

  networks(): Promise<Network[]> {
    return this.getAll<Network>('networks', 'networks')
  }

  nodes(): Promise<Node[]> {
    return this.getAll<Node>('nodes', 'nodes')
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