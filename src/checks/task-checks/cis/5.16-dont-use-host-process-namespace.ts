import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_16_dontUseHostProcessNamespace: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.16"
  , title: "Don't use host's process namespace"
  , description: "Ensure that the host's process namespace is not shared"
  , remediation: "You should not start a container with the --pid=host argument."
  , remediationImpact: `Container processes cannot see processes on the host system. In certain circumstances, you may want your container to share the host's process namespace. For example, you could build a container containing debugging tools such as strace or gdb, and want to use these tools when debugging processes on the host. If this is desired, then share specific host processes using the -p switch.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.PidMode == 'host') {
        return {
          state: State.fail
          , message: "PidMode set to 'host'"
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