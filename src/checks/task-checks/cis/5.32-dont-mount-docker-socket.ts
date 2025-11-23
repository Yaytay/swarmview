import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_32_dontMountDockerSocket: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.32"
  , title: "Don't mount docker socket"
  , description: "Ensure that the Docker socket is not mounted inside any containers"
  , remediation: "You should ensure that no containers mount docker.sock as a volume."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      const mounts = args.container.HostConfig?.Mounts
      if (mounts  && mounts.length > 0) {
        for (const mount of mounts) {
          if (mount.Source?.includes('docker.sock')) {
            return {
              state: State.fail
              , message: "Mounts " + mount.Source
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