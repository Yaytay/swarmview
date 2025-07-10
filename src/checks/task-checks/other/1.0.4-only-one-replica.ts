import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_4_only_one_replica: Check = {
  category: "Other"
  , id: "1.0.4"
  , title: 'Single replica'
  , description: "Tasks with only one replica will not remain available when nodes are maintained."
  , remediation: "Run two replicas"
  , remediationImpact: ""
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      replicas: 2
`

  , evaluate: function (args: CheckArguments): CheckResult {

    const isSwarm = args.container?.Config?.Labels?.hasOwnProperty('com.docker.stack.namespace')

    if (!isSwarm) {
      return {
        state: State.info
        , message: 'No replicas non-swarm container'
      }
    }

    const service = args.service;

    if (!service) {
      return {
        state: State.error
        , message: 'service not set'
      }
    }

    const mode = service.Spec?.Mode;

    if (mode?.Global) {
      return {
        state: State.pass
        , message: 'Global task, runs on all nodes'
      }
    }

    if (mode?.GlobalJob || mode?.ReplicatedJob) {
      return {
        state: State.pass
        , message: 'Task is a job, resilience is not required'
      }
    }

    const replicated = mode?.Replicated;

    if (!replicated) {
      return {
        state: State.warning
        , message: 'Unrecognised service mode'
      }
    }

    const replicas = replicated.Replicas;

    if (!replicas) {
      return {
        state: State.warning
        , value: replicas
        , message: 'Service replicas not configured'
        , threshold: 2
      }
    }

    if (replicas < 2) {
      return {
        state: State.warning
        , value: replicas
        , message: 'Service has ' + replicas + ' replica'
          + ((replicas == 1) ? '' : 's')
        , threshold: 2
      }
    }

    return {
      state: State.pass
      , value: replicas
      , threshold: 2
    }
  }
}
