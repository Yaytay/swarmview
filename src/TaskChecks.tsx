import { Check } from "./checks/checks";
import { ContainerInspectData, ContainerTopData, SystemInfo, Task } from "./docker-schema";
import ChecksUi from "./ChecksUi";
import { other_1_0_0_taskRestartPolicy } from "./checks/task-checks/other/1.0.0-task-restart-policy";
import { other_1_0_1_taskRestartPolicyLimit } from "./checks/task-checks/other/1.0.1-task-restart-policy-limit";
import { other_1_0_2_taskRestartPolicyDelay } from "./checks/task-checks/other/1.0.2-task-restart-policy-delay";
import { cis_5_2_appArmorEnabled } from "./checks/task-checks/cis/5.2-app-armor-enabled";
import { cis_5_3_seLinuxEnabled } from "./checks/task-checks/cis/5.3-selinux-enabled";
import { cis_5_4_kernelCapabilities } from "./checks/task-checks/cis/5.4-kernel-capabilities";
import { cis_5_5_noPrivileges } from "./checks/task-checks/cis/5.5-no-privileged";
import { cis_5_6_sensitiveDirectories } from "./checks/task-checks/cis/5.6-sensitive-directories";
import { cis_5_7_noSsh } from "./checks/task-checks/cis/5.7-no-ssh";

interface TaskChecksProps {
  task: Task
  , system?: SystemInfo
  , container?: ContainerInspectData
  , top?: ContainerTopData
}
function TaskChecks(props: TaskChecksProps) {

  const checks: Check[] = [
    cis_5_2_appArmorEnabled
    , cis_5_3_seLinuxEnabled
    , cis_5_4_kernelCapabilities
    , cis_5_5_noPrivileges
    , cis_5_6_sensitiveDirectories
    , cis_5_7_noSsh
    , other_1_0_0_taskRestartPolicy
    , other_1_0_1_taskRestartPolicyLimit
    , other_1_0_2_taskRestartPolicyDelay
  ]

  const args = { task: props.task, system: props.system, container: props.container, top: props.top }

  return (
    <ChecksUi id='task.checks' checks={checks} args={args} />
  )
}

export default TaskChecks