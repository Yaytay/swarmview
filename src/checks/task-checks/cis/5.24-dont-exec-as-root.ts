import { type Check, type CheckArguments, type CheckResult, State } from "../../checks"

export const cis_5_24_dontExecAsRoot: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.24"
  , suppressionKey: "cis_5_24_dontExecAsRoot"
  , title: "Don't exec as root"
  , description: "5.24 Ensure that docker exec commands are not used with the user=root option"
  , remediation: "You should not use the --user=root option in docker exec commands."
  , remediationImpact: ``
  , reference: ''

  , evaluate: (_: CheckArguments): CheckResult => ({
      state: State.info
      , message: 'Cannot be tested'
    })
}