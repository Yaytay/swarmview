import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_23_dontRunPrivileges: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.23"
  , title: "Don't run privileged"
  , description: "Ensure that docker exec commands are not used with the privileged option"
  , remediation: "You should not use the --privileged option in docker exec commands."
  , remediationImpact: `If you need enhanced capabilities within a container, then run it with all the permissions it requires. These should be specified individually.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.Privileged) {
        return {
          state: State.fail
          , message: "Container is privileged"
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