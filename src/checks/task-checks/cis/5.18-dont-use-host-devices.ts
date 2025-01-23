import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_18_dontUseHostDevices: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.18"
  , title: "Don't use host devices"
  , description: "Ensure that host devices are not directly exposed to containers"
  , remediation: "You should not start a container with the --ipc=host argument."
  , remediationImpact: `You should not directly expose host devices to containers. If you do need to expose host devices to containers, you should use granular permissions as appropriate to your organization.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.Devices) {
        return {
          state: State.fail
          , message: "The following devices are exposed: " + args.container.HostConfig.Devices.map(d => d.PathOnHost).join(', ')
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