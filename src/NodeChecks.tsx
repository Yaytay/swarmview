import DataTable, { DataTableValue } from "./DataTable";
import { Check } from "./checks/checks";
import { Node, Task } from "./docker-schema";
import { nodeMemorylimit } from "./checks/node-checks/other/1.0.0-memory-limit";
import { swarmMemorylimit } from "./checks/node-checks/other/1.0.1-total-memory-limit";
import Paper from "@mui/material/Paper";

interface NodeChecksProps {
  node: Node
  , nodes: Node[]
  , tasks: Task[]
}
function NodeChecks(props: NodeChecksProps) {

  const checks: Check[] = [
    nodeMemorylimit
    , swarmMemorylimit
  ]

  const headers = ['ID', 'CHECK', 'RESULT', 'THRESHOLD', 'VALUE', 'MESSAGE']

  const args = {node: props.node, nodes: props.nodes, tasks: props.tasks}

  const data = checks.reduce((acc, check) => {
    try {
      const result = check.evaluate(args)
      acc.push([check.id, check.title, result.state, result.threshold, result.value, result.message])
    } catch (ex) {
      acc.push([check.id, check.title, 'error', null, null, String(ex)])
    }
    return acc
  }, [] as DataTableValue[][])

  return (
    <Paper sx={{ flexGrow: 0, display: 'flex', flexFlow: 'column' }}>
      <DataTable id="node.checks.table" headers={headers} rows={data} rowStyle={r => {
        switch(r[2]){
          case 'fail':
            return { background: 'red' }
          case 'error':
            return { background: 'darkred' }
        }
      }} >

      </DataTable>
    </Paper>
  )
}

export default NodeChecks