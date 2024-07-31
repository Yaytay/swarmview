import DataTable, { DataTableValue } from "./DataTable";
import { Check } from "./checks/checks";
import { Task } from "./docker-schema";
import Paper from "@mui/material/Paper";
import { taskRestartPolicy } from "./checks/task-checks/other/1.0.0-task-restart-policy";
import { taskRestartPolicyLimit } from "./checks/task-checks/other/1.0.1-task-restart-policy-limit";
import { taskRestartPolicyDelay } from "./checks/task-checks/other/1.0.2-task-restart-policy-delay";

interface TaskChecksProps {
  task: Task
}
function TaskChecks(props: TaskChecksProps) {

  const checks: Check[] = [
    taskRestartPolicy
    , taskRestartPolicyLimit
    , taskRestartPolicyDelay
  ]

  const headers = ['ID', 'CHECK', 'RESULT', 'THRESHOLD', 'VALUE', 'ERROR']

  const args = { task: props.task }

  const data = checks.reduce((acc, check) => {
    try {
      const result = check.evaluate(args)
      acc.push([check.id, check.title, result.state, result.threshold, result.value, result.error])
    } catch (ex) {
      acc.push([check.id, check.title, 'error', null, null, String(ex)])
    }
    return acc
  }, [] as DataTableValue[][])

  return (
    <Paper sx={{ flexGrow: 0, display: 'flex', flexFlow: 'column' }}>
      <DataTable id="task.checks.table" headers={headers} rows={data} rowStyle={r => {
        switch (r[2]) {
          case 'fail':
            return { background: 'red' }
          case 'error':
            return { background: 'darkred' }
          case 'warning':
            return { background: 'yellow' }
        }
      }} >

      </DataTable>
    </Paper>
  )
}

export default TaskChecks