import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_4_kernelCapabilities: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.4"
  , title: 'Kernel capabilities'
  , description: "Ensure that Linux kernel capabilities are restricted within containers (Automated)"
  , remediation: "You could remove all the currently configured capabilities and then restore only the ones you specifically use: docker run --cap-drop=all --cap-add={<Capability 1>,<Capability 2>} <Run arguments> <Container Image Name or ID> <Command>"
  , remediationImpact: "Restrictions on processes within a container are based on which Linux capabilities are in force. Removal of the NET_RAW capability prevents the container from creating raw sockets which is good security practice under most circumstances, but may affect some networking utilities."
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      ...
    cap_drop:
    - ALL
  `

  , evaluate: function (args: CheckArguments): CheckResult {

    /*
    if (args.system && args.system.SecurityOptions && !args.system.SecurityOptions.find(v => v === 'name=no-new-privileges')) {
      return {
        state: State.pass
        , message: 'Node configured with no-new-privileges'
      }
    }
      */
    if (args.container) {
      if (args.container.HostConfig?.CapAdd) {
        return {
          state: State.fail
          , message: 'Adds kernel capabilities: ' + args.container.HostConfig?.CapAdd?.join(', ')
        }
      } else {
        if (args.container.HostConfig?.CapDrop?.find(cap => cap === 'NET_RAW') || args.container.HostConfig?.CapDrop?.find(cap => cap === 'ALL')) {
          return {
            state: State.pass
          }
        } else {
          return {
            state: State.fail
            , message: 'Does not remove NET_RAW capability: ' + (args.container.HostConfig?.CapDrop?.join(', ') || 'CapDrop not set')
          }
        }
      }
    } else {
      return {
        state: State.error
        , message: 'container not set'
      }
    }
  }
}