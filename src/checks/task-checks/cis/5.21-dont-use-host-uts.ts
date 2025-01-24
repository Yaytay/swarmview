import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_21_dontUseHostUts: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.21"
  , title: "Don't use host UTS"
  , description: "Ensure that the host's UTS namespace is not shared"
  , remediation: "You should not start a container with the --uts=host argument."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.UTSMode == 'host') {
        return {
          state: State.fail
          , message: "UTSMode set to 'host"
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