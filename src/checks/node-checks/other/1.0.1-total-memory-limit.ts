import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const swarmMemorylimit : Check = {
  category: "Other",
  id: "1.0.1",
  title: 'Swarm memory limit',
  description: "Is the total memory of all nodes sufficient for the tasks running on the swarm?",
  remediation: "Increase the memory of the nodes, increase the number of nodes, or reduce the memory limit of the tasks",
  reference: '',

  evaluate: function (args: CheckArguments): CheckResult {

    if (args.nodes && args.tasks) {
      const totalRequirement = args.tasks.reduce((acc, tsk) => {
        if (tsk.Status?.State == 'running') {
          return acc + (tsk.Spec?.Resources?.Limits?.MemoryBytes || 0)
        } else {
          return acc
        }
      }, 0)
      const totalNodes = args.nodes.reduce((acc, nod) => {
        return acc + (nod.Description?.Resources?.MemoryBytes || 0)
      }, 0)
      return {
        state: totalNodes > totalRequirement ? State.pass : State.fail
        , threshold: totalNodes / 1048576
        , value: totalRequirement / 1048576
      }

    } else {
      return {
        state: State.error
        , error: 'nodes not set'
      }
    }
  }
}