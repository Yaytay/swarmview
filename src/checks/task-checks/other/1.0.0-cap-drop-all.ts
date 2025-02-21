import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_0_capDropAll: Check = {
  category: "Other"
  , id: "1.0.0"
  , title: 'Cap-drop All'
  , description: "Ensure that containers are run without additional capabilities"
  , remediation: "Specify cap-drop=all and do not specify cap-add."
  , remediationImpact: ""
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

    if (args.container) {
      if (args.container.HostConfig?.CapDrop && args.container.HostConfig?.CapDrop.length > 0) {
        if (args.container.HostConfig?.CapDrop?.includes('ALL')) {
          if (args.container.HostConfig?.CapAdd && args.container.HostConfig?.CapAdd.length > 0) {
            return {
              state: State.fail
              , message: "cap-drop=all but cap-add=" + args.container.HostConfig?.CapAdd.join(', ')
            }
          } else {
            return {
              state: State.pass
            }
          }
        } else {
          return {
            state: State.fail
            , message: "cap-drop=" + args.container.HostConfig?.CapDrop?.join(', ')
          }
        }
      } else {
        return {
          state: State.fail
          , message: "cap-drop not set"
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