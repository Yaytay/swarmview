import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_20_dont_mount_shared: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.20"
  , title: "Don't mount with shared propagation"
  , description: "Ensure mount propagation mode is not set to shared"
  , remediation: "Do not mount volumes in shared mode propagation."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const mounts = args.container.HostConfig?.Mounts
      if (mounts && mounts.length > 0) {
        for (const mount of mounts) {
          if (mount.BindOptions?.Propagation == 'shared') {
            return {
              state: State.error
              , message: 'Mount ' + mount.Source + ':' + mount.Target + ' is mounted with shared propagation'
            }
          }
        }
      }
      return {
        state: State.pass
      }
    } else {
      return {
        state: State.error
        , message: 'process information from container not set'
      }
    }
  }
}