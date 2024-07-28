import { Node, Service, Stack, Task } from '../docker-schema'

export interface CheckArguments {
  node?: Node
  , stack?: Stack
  , service?: Service
  , task?: Task

  , nodes?: Node[]
  , stacks?: Stack[]
  , services?: Service[]
  , tasks?: Task[]
}

export enum state {
  pass = 'pass'
  , fail = 'fail'
  , warning = 'warning'
  , error = 'error'
}

export interface CheckResult {
  state: state
  , value?: number
  , threshold?: number
  , error?: string
}

export interface Check {
  category: string
  , id: string
  , title: string
  , description: string
  , remediation: string
  , reference: string

  , evaluate(args: CheckArguments) : CheckResult
}