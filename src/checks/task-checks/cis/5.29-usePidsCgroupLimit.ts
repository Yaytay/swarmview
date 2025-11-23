import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_29_usePidsCgroupLimit: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.29"
  , title: "Use PIDs cgroup limit"
  , description: "Ensure that the PIDs cgroup limit is used"
  , remediation: `Use --pids-limit flag with an appropriate value when launching the container.`
  , remediationImpact: `Set the PIDs limit value as appropriate. Incorrect values might leave containers unusable.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    const isSwarm = Object.prototype.hasOwnProperty.call(args.container?.Config?.Labels, 'com.docker.stack.namespace')      

    if (args.container) {
      if (args.container?.HostConfig?.PidsLimit) {
        return {
          state: State.pass
        }
      } else {
        return {
          state: isSwarm ? State.info : State.fail
          , message: 'PidsLimit not set'
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