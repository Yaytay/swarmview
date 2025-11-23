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

/* eslint-disable no-unused-vars */
export enum State {
  pass = 'pass'
  , info = 'info'
  , fail = 'fail'
  , warning = 'warning'
  , error = 'error'
}
/* eslint-enable no-unused-vars */

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

  , evaluate(_: CheckArguments) : CheckResult
}