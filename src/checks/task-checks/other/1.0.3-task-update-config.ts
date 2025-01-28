import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_3_taskUpdateConfig: Check = {
  category: "Other"
  , id: "1.0.3"
  , title: 'Update config'
  , description: "Does this task define an update config?"
  , remediation: "Define an update config"
  , remediationImpact: ""
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    const isSwarm = args.container?.Config?.Labels?.hasOwnProperty('com.docker.stack.namespace')

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