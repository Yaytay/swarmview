import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_8_noPrivilegedPorts: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.8"
  , title: 'No privileged host ports'
  , description: "Ensure privileged ports are not mapped within containers"
  , remediation: "You should not map container ports to privileged host ports when starting a container. You should also, ensure that there is no such container to host privileged port mapping declarations in the Dockerfile."
  , remediationImpact: "None."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const pb = args.container.HostConfig?.PortBindings
      if (pb) {
        for (const [key, mappings] of Object.entries(pb)) {
          if (mappings) {
            for (const mapping of mappings) {
              if (mapping.HostPort) {
                if (parseInt(mapping.HostPort, 10) <= 1024) {
                  return {
                    state: State.fail
                    , message: 'The container port ' + key + ' is mapped to the host port ' + mapping.HostPort + ' which is a privileged port (<1024).'
                  }
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