import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_15_restartOnFailure: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.15"
  , title: 'Restart on-failure max 5'
  , description: "Ensure that the 'on-failure' container restart policy is set to '5'"
  , remediation: `If you wish a container to be automatically restarted, a sample command is as below:

docker run --detach --restart=on-failure:5 nginx`
  , remediationImpact: "If this option is set, a container will only attempt to restart itself 5 times."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const rp = args.container.HostConfig?.RestartPolicy

      if (rp) {
        if (rp.Name == '') {
          return {
            state: State.fail
            , message: 'restart-policy configured with no name'
          }
        } else if (rp.Name == "on-failure") {
          if (!rp.MaximumRetryCount) {
            return {
              state: State.fail
              , message: 'restart-policy not configured with a maximum retry count'
            }
          }
          if (rp.MaximumRetryCount < 5) {
            return {
              state: State.warning
              , message: 'restart-policy configured with a very low maximum retry count (' + rp.MaximumRetryCount + ')'
            }
          } else if (rp.MaximumRetryCount > 5) {
            return {
              state: State.warning
              , message: 'restart-policy configured with a high maximum retry count (' + rp.MaximumRetryCount + ')'
            }
          } else {
            return {
              state: State.pass
            }
          }
        } else {
          return {
            state: State.fail
            , message: "restart-policy configured as '" + rp.Name + "'"
          }
        }
      } else {
        return {
          state: State.fail
          , message: 'No restart-policy configured'
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