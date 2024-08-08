import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_5_noPrivileges: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.5"
  , title: 'Not privileged'
  , reference: ''
  , description: "Ensure that privileged containers are not used (Automated)"
  , remediation: "You should not run containers with the --privileged flag."
  , remediationImpact: "If you start a container without the --privileged flag, it will not have excessive default capabilities."

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
      if (args.container.HostConfig?.Privileged) {
        return {
          state: State.fail
          , message: 'Container is privileged'
        }
      } else {
        return {
          state: State.pass
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