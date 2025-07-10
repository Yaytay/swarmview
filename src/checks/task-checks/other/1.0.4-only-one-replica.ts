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

    if (!args.service) {
      return {
        state: State.error
        , message: 'service not set'
      }
    }

    if (args.service?.Spec?.Mode?.Global) {
      return {
        state: State.pass
        , message: 'Global task, runs on all nodes'
      }
    }

    if (args.service?.Spec?.Mode?.GlobalJob || args.service?.Spec?.Mode?.ReplicatedJob) {
      return {
        state: State.pass
        , message: 'Task is a job, resilience is not required'
      }
    }

    if (!args.service?.Spec?.Mode?.Replicated) {
      return {
        state: State.warning
        , message: 'Unrecognised service mode'
      }
    }

    if (!args.service?.Spec?.Mode?.Replicated.Replicas) {
      return {
        state: State.warning
        , value: args.service?.Spec?.Mode?.Replicated.Replicas
        , message: 'Service replicas not configured'
        , threshold: 2
      }
    }

    if (args.service?.Spec?.Mode?.Replicated.Replicas < 2) {
      return {
        state: State.warning
        , value: args.service?.Spec?.Mode?.Replicated.Replicas
        , message: 'Service has ' + args.service?.Spec?.Mode?.Replicated.Replicas + ' replica'
          + ((args.service?.Spec?.Mode?.Replicated.Replicas == 1) ? '' : 's')
        , threshold: 2
      }
    }

    return {
      state: State.pass
      , value: args.service?.Spec?.Mode?.Replicated.Replicas
      , threshold: 2
    }
  }
}