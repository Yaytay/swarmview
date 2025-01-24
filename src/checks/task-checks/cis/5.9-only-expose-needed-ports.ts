import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_9_onlyExposeNeededPorts: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.9"
  , title: 'Only expose needed ports'
  , description: "Ensure that only needed ports are open on the container"
  , remediation: "You should ensure that the Dockerfile for each container image only exposes needed ports."
  , remediationImpact: "Failing to expose required ports will impact functionality."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const pb = args.container.HostConfig?.PortBindings
      if (pb) {
        const keys = Object.keys(pb)
        if (keys.length > 0) {
          return {
            state: State.info
            , message: 'The following ports are exposed: ' + Object.keys(pb)
          }
        } else {
          return {
            state: State.pass
          }
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