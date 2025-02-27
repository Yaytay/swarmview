import { Containers, Node, Service, SystemInfo, Task } from '../docker-schema'

export interface CheckArguments {
    node?: Node
  , stack?: string
  , service?: Service
  , task?: Task
  , system?: SystemInfo
  , container?: Containers.ContainerInspect.ResponseBody
  , top?: Containers.ContainerTop.ResponseBody

  , nodes?: Node[]
  , stacks?: string[]
  , services?: Service[]
  , tasks?: Task[]
}

export enum State {
  pass = 'pass'
  , info = 'info'
  , fail = 'fail'
  , warning = 'warning'
  , error = 'error'
}

export interface CheckResult {
  state: State
  , value?: number
  , threshold?: number
  , message?: string
}

export interface Check {
  category: string
  , id: string
  , title: string
  , description: string
  , remediation: string
  , remediationImpact: string
  , reference: string
  , example?: string

  , evaluate(args: CheckArguments) : CheckResult
}