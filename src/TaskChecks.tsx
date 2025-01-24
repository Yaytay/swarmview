import { Check } from "./checks/checks";
import { Containers, SystemInfo, Task } from "./docker-schema";
import ChecksUi from "./ChecksUi";
import { other_1_0_0_capDropAll } from "./checks/task-checks/other/1.0.0-cap-drop-all";
import { other_1_0_1_dontRunAsRoot } from "./checks/task-checks/other/1.0.1-dont-run-as-root";
import { other_1_0_2_taskRestartPolicyDelay } from "./checks/task-checks/other/1.0.2-task-restart-policy-delay";
import { cis_5_2_appArmorEnabled } from "./checks/task-checks/cis/5.2-app-armor-enabled";
import { cis_5_3_seLinuxEnabled } from "./checks/task-checks/cis/5.3-selinux-enabled";
import { cis_5_4_kernelCapabilities } from "./checks/task-checks/cis/5.4-kernel-capabilities";
import { cis_5_5_noPrivileges } from "./checks/task-checks/cis/5.5-no-privileged";
import { cis_5_6_sensitiveDirectories } from "./checks/task-checks/cis/5.6-sensitive-directories";
import { cis_5_7_noSsh } from "./checks/task-checks/cis/5.7-no-ssh";
import { cis_5_8_noPrivilegedPorts } from "./checks/task-checks/cis/5.8-no-privileged-host-ports";
import { cis_5_9_onlyExposeNeededPorts } from "./checks/task-checks/cis/5.9-only-expose-needed-ports";
import { cis_5_10_dontUseHostNetworking } from "./checks/task-checks/cis/5.10-dont-user-host-networking";
import { cis_5_11_limitMemory } from "./checks/task-checks/cis/5.11-limit-memory";
import { cis_5_12_limitCpu } from "./checks/task-checks/cis/5.12-limit-cpu";
import { cis_5_13_rootFsReadOnly } from "./checks/task-checks/cis/5.13-rootfs-read-only";
import { cis_5_14_exposeOnSpecificIp } from "./checks/task-checks/cis/5.14-expose-on-specific-ip";
import { cis_5_15_restartOnFailure } from "./checks/task-checks/cis/5.15-restart-on-failure-max-5";
import { cis_5_16_dontUseHostProcessNamespace } from "./checks/task-checks/cis/5.16-dont-use-host-process-namespace";
import { cis_5_17_dontUseHostIpcNamespace } from "./checks/task-checks/cis/5.17-dont-use-host-ipc-namespace";
import { cis_5_18_dontUseHostDevices } from "./checks/task-checks/cis/5.18-dont-use-host-devices";
import { cis_5_19_override_default_ulimit } from "./checks/task-checks/cis/5.19-overdide-default-ulimit";
import { cis_5_20_dont_mount_shared } from "./checks/task-checks/cis/5.20-dont-mount-shared";
import { cis_5_21_dontUseHostUts } from "./checks/task-checks/cis/5.21-dont-use-host-uts";
import { cis_5_22_dontDisableDefaultSeccomp } from "./checks/task-checks/cis/5.22-dont-disable-default-seccomp";
import { cis_5_23_dontRunPrivileges } from "./checks/task-checks/cis/5.23-dont-run-privileged";
import { cis_5_24_dontExecAsRoot } from "./checks/task-checks/cis/5.24-dont-exec-as-root";
import { cis_5_25_ensureCgroupsConfirmed } from "./checks/task-checks/cis/5.25-ensure-cgroups-confirmed";
import { cis_5_26_preventAdditionalPrivileges } from "./checks/task-checks/cis/5.26-prevent-additional-privileges";

interface TaskChecksProps {
  task: Task
  , system?: SystemInfo
  , container?: Containers.ContainerInspect.ResponseBody
  , top?: Containers.ContainerTop.ResponseBody
}

function TaskChecks(props: TaskChecksProps) {

  const checks: Check[] = [
    cis_5_2_appArmorEnabled
    , cis_5_3_seLinuxEnabled
    , cis_5_4_kernelCapabilities
    , cis_5_5_noPrivileges
    , cis_5_6_sensitiveDirectories
    , cis_5_7_noSsh
    , cis_5_8_noPrivilegedPorts
    , cis_5_9_onlyExposeNeededPorts
    , cis_5_10_dontUseHostNetworking
    , cis_5_11_limitMemory
    , cis_5_12_limitCpu
    , cis_5_13_rootFsReadOnly
    , cis_5_14_exposeOnSpecificIp
    , cis_5_15_restartOnFailure
    , cis_5_16_dontUseHostProcessNamespace
    , cis_5_17_dontUseHostIpcNamespace
    , cis_5_18_dontUseHostDevices
    , cis_5_19_override_default_ulimit
    , cis_5_20_dont_mount_shared
    , cis_5_21_dontUseHostUts
    , cis_5_22_dontDisableDefaultSeccomp
    , cis_5_23_dontRunPrivileges
    , cis_5_24_dontExecAsRoot
    , cis_5_25_ensureCgroupsConfirmed
    , cis_5_26_preventAdditionalPrivileges
    , other_1_0_0_capDropAll
    , other_1_0_1_dontRunAsRoot
    , other_1_0_2_taskRestartPolicyDelay
  ]

  const args = { task: props.task, system: props.system, container: props.container, top: props.top }

  return (
    <ChecksUi id='task.checks' checks={checks} args={args} />
  )
}

export default TaskChecks