import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const taskRestartPolicy: Check = {
  category: "Other"
  , id: "1.0.0"
  , title: 'Restart policy'
  , description: "Does this task define a restart policy?"
  , remediation: "Define a restart policy to control restart-loops"
  , remediationImpact: ""
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.task) {
      if (args.task?.Spec?.RestartPolicy) {
        return {
          state: State.pass
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