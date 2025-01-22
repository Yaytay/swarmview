import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_11_limitMemory: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.11"
  , title: 'Limit memory'
  , description: "Ensure that the memory usage for containers is limited"
  , remediation: "You should run the container with only as much memory as it requires by using the --memory argument."
  , remediationImpact: "If correct memory limits are not set on each container, one process can expand its usage and cause other containers to run out of resources."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.Memory) {
        return {
          state: State.pass
        }
      } else {
        return {
          state: State.fail
          , message: 'Memory limit not specified for container'
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