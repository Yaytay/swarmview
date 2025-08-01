import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_2_taskRestartPolicyDelay: Check = {
  category: "Other"
  , id: "1.0.2"
  , title: 'Restart policy with delay'
  , description: "Does this task define a restart policy with a delay?"
  , remediation: "Define a restart policy with a delay to control restart-loops"
  , remediationImpact: ""
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      ...
      restart_policy:
        condition: on-failure
        max_attempts: 5
        delay: 15s
        window: 120s
`

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.service) {
      if (args.service?.Spec?.TaskTemplate?.RestartPolicy?.Delay) {
        return {
          state: State.pass
          , value: args.task?.Spec?.RestartPolicy?.Delay
        }
      } else {
        return {
          state: State.fail
        }
      }
    } else {
      return {
        state: State.error
        , message: 'task not set'
      }
    }
  }
}