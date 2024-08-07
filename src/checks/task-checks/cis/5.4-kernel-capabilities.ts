import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const kernelCapabilities: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.4"
  , title: 'Kernel capabilities'
  , description: "Ensure that Linux kernel capabilities are restricted within containers (Automated)"
  , remediation: "You could remove all the currently configured capabilities and then restore only the ones you specifically use: docker run --cap-drop=all --cap-add={<Capability 1>,<Capability 2>} <Run arguments> <Container Image Name or ID> <Command>"
  , remediationImpact: "Restrictions on processes within a container are based on which Linux capabilities are in force. Removal of the NET_RAW capability prevents the container from creating raw sockets which is good security practice under most circumstances, but may affect some networking utilities."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.system && args.system.SecurityOptions && !args.system.SecurityOptions.find(v => v === 'name=no-new-privileges')) {
      return {
        state: State.pass
        , message: 'Node configured with no-new-privileges'
      }
    }
    if (args.task) {
      if (args.task?.Spec?.ContainerSpec?.Privileges?.SELinuxContext) {
        return {
          state: args.task?.Spec?.ContainerSpec?.Privileges?.SELinuxContext.Disable ? State.fail : State.pass
        }
      } else {
        return {
          state: State.warning
          , message: 'SELinux not configured'
        }
      }
    } else {
      return {
        state: State.error
        , message: 'task not set'
      }
    }
  }
}