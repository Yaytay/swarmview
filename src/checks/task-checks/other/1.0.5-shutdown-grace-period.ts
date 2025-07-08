import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_5_shutdown_grace_period: Check = {
  category: "Other"
  , id: "1.0.5"
  , title: 'Shutdown grace period'
  , description: "A shutdown grace period should be defined."
  , remediation: "Specify a shutdown grace period."
  , remediationImpact: ""
  , reference: 'https://docs.docker.com/reference/cli/docker/container/stop/'
  , example: `
services:
  swarmview:
    ...
    stop_grace_period: 70s
    deploy:
      ...
`

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.service) {
      if (!args.service?.Spec?.TaskTemplate?.ContainerSpec?.StopGracePeriod) {
        return {
          state: State.fail
          , message: 'Stop grace period not set'
        }
      } else {
        return {
          state: State.pass
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