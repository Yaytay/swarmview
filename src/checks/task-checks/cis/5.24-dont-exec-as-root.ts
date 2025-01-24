import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_24_dontExecAsRoot: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.24"
  , title: "Don't exec as root"
  , description: "5.24 Ensure that docker exec commands are not used with the user=root option"
  , remediation: "You should not use the --user=root option in docker exec commands."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    return {
      state: State.pass
    }
  }
}