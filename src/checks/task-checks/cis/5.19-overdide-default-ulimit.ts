import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_19_override_default_ulimit: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.19"
  , title: "Override default ulimit"
  , description: "Ensure that the default ulimit is overwritten at runtime"
  , remediation: "You should only override the default ulimit settings if needed in a specific case."
  , remediationImpact: `If ulimits are not set correctly, overutilization by individual containers could make the host system unusable.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.Ulimits && args.container.HostConfig?.Ulimits.length > 0) {
        return {
          state: State.pass
          , message: "ULimits are configured, please ensure they are appropriate"
        }
      } else {
        return {
          state: State.warning
          , message: 'No ULimits are configured at either the container or host level'
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