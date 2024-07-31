import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const nodeMemorylimit : Check = {
  category: "Other",
  id: "1.0.0",
  title: 'Node memory limit',
  description: "Does this node have mode memory than the limit of the tasks running on it?",
  remediation: "Increase the memory of the node, increase the number of nodes, or reduce the memory limit of the tasks",
  reference: '',

  evaluate: function (args: CheckArguments): CheckResult {

    if (args.node && args.tasks) {
      const totalRequirement = args.tasks.reduce((acc, tsk) => {
        if (tsk.NodeID === args.node?.ID && tsk.Status?.State == 'running') {
          return acc + (tsk.Spec?.Resources?.Limits?.MemoryBytes || 0)
        } else {
          return acc
        }
      }, 0)
      return {
        state: (args.node.Description?.Resources?.MemoryBytes || 0) > totalRequirement ? State.pass : State.fail
        , threshold: (args.node.Description?.Resources?.MemoryBytes || 0) / 1048576
        , value: totalRequirement / 1048576
      }

    } else {
      return {
        state: State.error
        , error: (args.node && 'tasks not set' || 'node not set')
      }
    }
  }
}