import { Check } from "./checks/checks";
import { SystemInfo, Task } from "./docker-schema";
import { taskRestartPolicy } from "./checks/task-checks/other/1.0.0-task-restart-policy";
import { taskRestartPolicyLimit } from "./checks/task-checks/other/1.0.1-task-restart-policy-limit";
import { taskRestartPolicyDelay } from "./checks/task-checks/other/1.0.2-task-restart-policy-delay";
import { appArmorEnabled } from "./checks/task-checks/cis/5.2-app-armor-enabled";
import { seLinuxEnabled } from "./checks/task-checks/cis/5.3-selinux-enabled";
import ChecksUi from "./ChecksUi";

interface TaskChecksProps {
  task: Task
  , system?: SystemInfo
}
function TaskChecks(props: TaskChecksProps) {

  const checks: Check[] = [
    appArmorEnabled
    , seLinuxEnabled
    , taskRestartPolicy
    , taskRestartPolicyLimit
    , taskRestartPolicyDelay
  ]

  const args = { task: props.task, system: props.system }

  return (
    <ChecksUi id='task.checks' checks={checks} args={args} />
  )
}

export default TaskChecks