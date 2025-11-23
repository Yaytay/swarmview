import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_3_taskUpdateConfig: Check = {
  category: "Other"
  , id: "1.0.3"
  , title: 'Update config'
  , description: "Does this task define an update config?"
  , remediation: "Define an update config"
  , remediationImpact: ""
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      ...
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
`

  , evaluate: function (args: CheckArguments): CheckResult {

    const isSwarm = Object.prototype.hasOwnProperty.call(args.container?.Config?.Labels, 'com.docker.stack.namespace')      

    if (!isSwarm) {
      return {
        state: State.info
        , message: 'No update-config for non-swarm container'
      }
    }

    if (args.service) {
      if (args.service?.Spec?.UpdateConfig) {
        return {
          state: State.pass
        }
      } else {
        return {
          state: State.fail
          , message: "Update config not set on service " + args.service.Spec?.Name || args.service.ID
        }
      }
    } else {
      return {
        state: State.error
        , message: 'service not set'
      }
    }
  }
}