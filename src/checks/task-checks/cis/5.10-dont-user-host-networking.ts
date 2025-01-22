import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_10_dontUseHostNetworking: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.10"
  , title: 'Don\'t use Host networking'
  , description: "Ensure that the host's network namespace is not shared"
  , remediation: "You should not pass the --net=host option when starting any container."
  , remediationImpact: "."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.NetworkMode == 'host') {
        return {
          state: State.fail
          , message: 'NetworkMode set to Host'
        }
      } else {
        return {
          state: State.pass
        }
      }
    } else {
      return {
        state: State.error
        , message: 'process information from container not set'
      }
    }
  }
}