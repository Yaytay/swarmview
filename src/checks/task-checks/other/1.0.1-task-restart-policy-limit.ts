import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const taskRestartPolicyLimit: Check = {
  category: "Other"
  , id: "1.0.1"
  , title: 'Restart policy with limit'
  , description: "Does this task define a restart policy with a limit?"
  , remediation: "Define a restart policy with a limit to control restart-loops"
  , remediationImpact: ""
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.task) {
      if (args.task?.Spec?.RestartPolicy?.MaxAttempts) {
        return {
          state: State.pass
          , value: args.task?.Spec?.RestartPolicy?.MaxAttempts
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