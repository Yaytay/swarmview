import { memorylimits } from "./checks/node-checks/other/1.0.0-memory-limit";
import DataTable, { DataTableValue } from "./DataTable";
import Check from "./checks/checks";
import { Node, Task } from "./docker-schema";

interface NodeChecksProps {
  node: Node
  , tasks: Task[]
}
function NodeChecks(props: NodeChecksProps) {

  const checks: Check.Check[] = [
    memorylimits
  ]

  const headers = ['ID', 'CHECK', 'RESULT', 'THRESHOLD', 'VALUE', 'ERROR']

  const args = {node: props.node, tasks: props.tasks}

  const data = checks.reduce((acc, check) => {
    try {
      const result = check.evaluate(args)
      acc.push([check.id, check.title, result.state, result.threshold, result.value, null])
    } catch (ex) {
      acc.push([check.id, check.title, 'error', null, null, String(ex)])
    }
    return acc
  }, [] as DataTableValue[][])

  return (
    <DataTable id="node.checks.table" headers={headers} rows={data}>

    </DataTable>
  )
}

export default NodeChecks