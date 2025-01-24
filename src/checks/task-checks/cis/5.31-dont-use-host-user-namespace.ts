import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_31_dontUseHostUserNamespace: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.31"
  , title: "Don't use host user namespace"
  , description: "Ensure that the host's user namespaces are not shared"
  , remediation: "You should not share user namespaces between host and containers."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.UsernsMode == 'host') {
        return {
          state: State.fail
          , message: "UsernsMode set to 'host"
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