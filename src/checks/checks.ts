import { Node, Service, Task } from '../docker-schema'

export interface CheckArguments {
  node?: Node
  , stack?: string
  , service?: Service
  , task?: Task

  , nodes?: Node[]
  , stacks?: string[]
  , services?: Service[]
  , tasks?: Task[]
}

export enum State {
  pass = 'pass'
  , fail = 'fail'
  , warning = 'warning'
  , error = 'error'
}

export interface CheckResult {
  state: State
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