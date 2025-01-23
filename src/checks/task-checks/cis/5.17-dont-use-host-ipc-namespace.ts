import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_17_dontUseHostIpcNamespace: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.17"
  , title: "Don't use host's IPC namespace"
  , description: "Ensure that the host's IPC namespace is not shared"
  , remediation: "You should not start a container with the --ipc=host argument."
  , remediationImpact: `Shared memory segments are used in order to accelerate interprocess communications, commonly in high-performance applications. If this type of application is containerized into multiple containers, you might need to share the IPC namespace of the containers in order to achieve high performance. Under these circumstances, you should still only share container specific IPC namespaces and not the host IPC namespace.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.IpcMode == 'host') {
        return {
          state: State.fail
          , message: "IPC mode set to 'host'"
        }
      } else if (args.container.HostConfig?.IpcMode) {
        return {
          state: State.fail
          , message: "IPC mode set to '" + args.container.HostConfig?.IpcMode + "'"
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