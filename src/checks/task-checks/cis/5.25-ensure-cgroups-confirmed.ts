import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_25_ensureCgroupsConfirmed: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.25"
  , title: "Ensure CGroups confirmed"
  , description: "Ensure that cgroup usage is confirmed"
  , remediation: "You should not use the --cgroup-parent option within the docker run command unless strictly required."
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.Cgroup) {
        return {
          state: State.fail
          , message: "Container is configured with cgroup " + args.container.HostConfig?.Cgroup
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