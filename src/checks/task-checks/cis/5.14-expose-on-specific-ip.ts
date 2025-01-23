import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_14_exposeOnSpecificIp: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.14"
  , title: 'Bind to a specific IP'
  , description: " Ensure that incoming container traffic is bound to a specific host interface"
  , remediation: "You should not pass the --net=host option when starting any container."
  , remediationImpact: "."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const isSwarm = args.container.Config?.Labels?.hasOwnProperty('com.docker.stack.namespace')

      const pb = args.container.HostConfig?.PortBindings
      if (pb) {
        for (const [key, mappings] of Object.entries(pb)) {
          if (mappings) {
            for (const mapping of mappings) {
              if (mapping.HostIp) {
                if (mapping.HostIp == '0.0.0.0') {
                  return {
                    state: isSwarm ? State.info : State.fail
                    , message: 'The container port ' + key + ' is mapped to the host IP ' + mapping.HostIp + ' which is not specific.'
                  }
                }
              } else {
                return {
                  state: isSwarm ? State.info : State.fail
                  , message: 'The container port ' + key + ' is mapped to a specific port but not to a specific address.'
                }
              }
            }
          }
        }
        return {
          state: State.pass
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