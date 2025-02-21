import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_12_limitCpu: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.12"
  , title: 'Limit CPU shares'
  , description: "Ensure that CPU priority is set appropriately on containers"
  , remediation: "You should manage the CPU runtime between your containers dependent on their priority within your organization. To do so start the container using the --cpu-shares argument."
  , remediationImpact: "If you do not correctly assign CPU thresholds, the container process may run out of resources and become unresponsive. If CPU resources on the host are not constrainted, CPU shares do not place any restrictions on individual resources."
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      ...
      resources:
        limits:
          cpus: '1'
  `

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.CpuShares) {
        return {
          state: State.pass
        }
      } else {
        const isSwarm = args.container?.Config?.Labels?.hasOwnProperty('com.docker.stack.namespace')

        if (isSwarm) {
          return {
            state: State.info
            , message: 'CPU shares cannot be specified in Docker Swarm'
          }
        } else {
          return {
            state: State.fail
            , message: 'CPU shares not specified for container'
          }
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