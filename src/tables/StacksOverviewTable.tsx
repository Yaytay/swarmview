import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import CircularProgress from '@mui/material/CircularProgress';
import { Service, SystemInfo, Task } from '../docker-schema';
import { DockerApi } from '../DockerApi';
import { other_1_0_0_capDropAll } from "../checks/task-checks/other/1.0.0-cap-drop-all";
import { other_1_0_1_dontRunAsRoot } from "../checks/task-checks/other/1.0.1-dont-run-as-root";
import { other_1_0_2_taskRestartPolicyDelay } from "../checks/task-checks/other/1.0.2-task-restart-policy-delay";
import { cis_5_2_appArmorEnabled } from "../checks/task-checks/cis/5.2-app-armor-enabled";
import { cis_5_3_seLinuxEnabled } from "../checks/task-checks/cis/5.3-selinux-enabled";
import { cis_5_4_kernelCapabilities } from "../checks/task-checks/cis/5.4-kernel-capabilities";
import { cis_5_5_noPrivileges } from "../checks/task-checks/cis/5.5-no-privileged";
import { cis_5_6_sensitiveDirectories } from "../checks/task-checks/cis/5.6-sensitive-directories";
import { cis_5_7_noSsh } from "../checks/task-checks/cis/5.7-no-ssh";
import { cis_5_8_noPrivilegedPorts } from "../checks/task-checks/cis/5.8-no-privileged-host-ports";
import { cis_5_9_onlyExposeNeededPorts } from "../checks/task-checks/cis/5.9-only-expose-needed-ports";
import { cis_5_10_dontUseHostNetworking } from "../checks/task-checks/cis/5.10-dont-user-host-networking";
import { cis_5_11_limitMemory } from "../checks/task-checks/cis/5.11-limit-memory";
import { cis_5_12_limitCpu } from "../checks/task-checks/cis/5.12-limit-cpu";
import { cis_5_13_rootFsReadOnly } from "../checks/task-checks/cis/5.13-rootfs-read-only";
import { cis_5_14_exposeOnSpecificIp } from "../checks/task-checks/cis/5.14-expose-on-specific-ip";
import { cis_5_15_restartOnFailure } from "../checks/task-checks/cis/5.15-restart-on-failure-max-5";
import { cis_5_16_dontUseHostProcessNamespace } from "../checks/task-checks/cis/5.16-dont-use-host-process-namespace";
import { cis_5_17_dontUseHostIpcNamespace } from "../checks/task-checks/cis/5.17-dont-use-host-ipc-namespace";
import { cis_5_18_dontUseHostDevices } from "../checks/task-checks/cis/5.18-dont-use-host-devices";
import { cis_5_19_override_default_ulimit } from "../checks/task-checks/cis/5.19-overdide-default-ulimit";
import { cis_5_20_dont_mount_shared } from "../checks/task-checks/cis/5.20-dont-mount-shared";
import { cis_5_21_dontUseHostUts } from "../checks/task-checks/cis/5.21-dont-use-host-uts";
import { cis_5_22_dontDisableDefaultSeccomp } from "../checks/task-checks/cis/5.22-dont-disable-default-seccomp";
import { cis_5_23_dontRunPrivileges } from "../checks/task-checks/cis/5.23-dont-run-privileged";
import { cis_5_24_dontExecAsRoot } from "../checks/task-checks/cis/5.24-dont-exec-as-root";
import { cis_5_25_ensureCgroupsConfirmed } from "../checks/task-checks/cis/5.25-ensure-cgroups-confirmed";
import { cis_5_26_preventAdditionalPrivileges } from "../checks/task-checks/cis/5.26-prevent-additional-privileges";
import { cis_5_27_configureHealthCheck } from "../checks/task-checks/cis/5.27-configureHealthCheck";
import { cis_5_28_useMostRecentImage } from "../checks/task-checks/cis/5.28-useMostRecentImage";
import { cis_5_29_usePidsCgroupLimit } from "../checks/task-checks/cis/5.29-usePidsCgroupLimit";
import { cis_5_30_dontUseDocker0Bridge } from "../checks/task-checks/cis/5.30-dontUseDocker0Bridge";
import { cis_5_31_dontUseHostUserNamespace } from "../checks/task-checks/cis/5.31-dont-use-host-user-namespace";
import { cis_5_32_dontMountDockerSocket } from "../checks/task-checks/cis/5.32-dont-mount-docker-socket";
import { other_1_0_3_taskUpdateConfig } from "../checks/task-checks/other/1.0.3-task-update-config";
import { other_1_0_4_only_one_replica } from "../checks/task-checks/other/1.0.4-only-one-replica";
import { other_1_0_5_shutdown_grace_period } from "../checks/task-checks/other/1.0.5-shutdown-grace-period";
import { other_1_0_6_hostname_specified } from "../checks/task-checks/other/1.0.6-hostname-specified";
import { Check, CheckResult, evaluateCheck } from '../checks/checks';

//
// ─────────────────────────────────────────────────────────────
//   Data Models
// ─────────────────────────────────────────────────────────────
//

export interface Issue {
  check: Check
  result: CheckResult
}

export interface ServiceOverview {
  id: string;
  name: string;
  issues?: Issue[];     // undefined = pending
  issueCount?: number;         // undefined = pending
}

export interface StackOverview {
  stack: string;
  services: ServiceOverview[];
  issueCount?: number;         // undefined = pending
}

interface StackOverviewProps {
  id: string;
  docker: DockerApi;
}


//
// ─────────────────────────────────────────────────────────────
// Checks
// ─────────────────────────────────────────────────────────────
//

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
    , cis_5_27_configureHealthCheck
    , cis_5_28_useMostRecentImage
    , cis_5_29_usePidsCgroupLimit
    , cis_5_30_dontUseDocker0Bridge
    , cis_5_31_dontUseHostUserNamespace
    , cis_5_32_dontMountDockerSocket
    , other_1_0_0_capDropAll
    , other_1_0_1_dontRunAsRoot
    , other_1_0_2_taskRestartPolicyDelay
    , other_1_0_3_taskUpdateConfig
    , other_1_0_4_only_one_replica
    , other_1_0_5_shutdown_grace_period
    , other_1_0_6_hostname_specified
  ]


//
// ─────────────────────────────────────────────────────────────
//   Issues Table (Level 3)
// ─────────────────────────────────────────────────────────────
//

const IssuesTable = React.memo(function IssuesTable({ issues }: { issues?: Issue[] }) {
  const issueColumns = useMemo<MRT_ColumnDef<Issue>[]>(() => [
    { accessorKey: 'check.id', header: 'ID' },
    { accessorKey: 'check.title', header: 'Check' },
    { accessorKey: 'result.state', header: 'State' },
    { accessorKey: 'result.message', header: 'Message' },
    { accessorKey: 'result.value', header: 'Value' },
  ], []);

  return (
    <MaterialReactTable
      columns={issueColumns}
      data={issues ?? []}
      enableExpanding={false}
      enablePagination={false}
      enableTopToolbar={false}
      enableBottomToolbar={false}
      initialState={{ density: 'compact' }}
    />
  );
});

//
// ─────────────────────────────────────────────────────────────
//   Services Table (Level 2)
// ─────────────────────────────────────────────────────────────
//

const ServicesTable = React.memo(function ServicesTable({
  services,
}: {
  services: ServiceOverview[];
}) {
  const serviceColumns = useMemo<MRT_ColumnDef<ServiceOverview>[]>(() => [
    { accessorKey: 'name', header: 'Service' },
    {
      header: 'Issues',
      Cell: ({ row }) => {
        const svc = row.original;
        return svc.issueCount === undefined
          ? <CircularProgress size={18} />
          : svc.issueCount;
      },
    },
  ], []);

  return (
    <MaterialReactTable
      columns={serviceColumns}
      data={services}
      enableExpanding
      // Only allow expansion when issues are loaded
      enableExpandAll={false}
      enablePagination={false}
      enableTopToolbar={false}
      enableBottomToolbar={false}
      muiTableBodyRowProps={({ row }) => ({
        sx: {
          cursor: row.original.issueCount === undefined ? 'not-allowed' : 'pointer',
          opacity: row.original.issueCount === undefined ? 0.5 : 1,
        },
      })}
      renderDetailPanel={({ row }) => {
        const svc = row.original;
        if (!svc.issues) return null; // cannot expand pending services
        return <IssuesTable issues={svc.issues} />;
      }}
      initialState={{ density: 'compact' }}
    />
  );
});

//
// ─────────────────────────────────────────────────────────────
//   Stacks Table (Level 1)
// ─────────────────────────────────────────────────────────────
//

export default function StacksOverviewTable(props: StackOverviewProps) {
  //
  // ─── Initial Data (replace with real stacks/services) ─────
  //
  const [servicesById, setServicesById] = useState<Map<string, Service>>()
  const [stacks, setStacks] = useState<StackOverview[]>([])
  const [tasks, setTasks] = useState<Task[]>()
  const [systemsByNodeId, setSystemsByNodesId] = useState<Map<string, SystemInfo>>()
  
  useEffect(() => {
    Promise.all([
      props.docker.servicesById()
      , props.docker.nodesById()
      , props.docker.tasks()
    ]).then(value => {
      setServicesById(value[0])
      setStacks(createStackOverviews(Array.from(value[0].values())))
      setTasks(value[2])

      const nodeIds = Array.from(value[1].keys());

      return Promise.all(
        nodeIds.map(nodeId => props.docker.system(nodeId).then(info => [nodeId, info] as const))
      ).then(entries => setSystemsByNodesId(new Map(entries)));

    })
  }, [props.id, props.docker])

  //
  // ─── Background async loading of issues for each service ──
  //
  useEffect(() => {
    stacks.forEach((stack) => {
      stack.services.forEach((svc) => {

        const task = tasks?.find(tsk => {
          return tsk.ServiceID == svc.id && tsk.ID && tsk.Status?.State == 'running';
        })

        if (task && task.ID && task.NodeID) {          
          // Start async job for each service
          props.docker.container(task.NodeID, task.ID)
          .then(ctr => {
            const service = servicesById?.get(svc.id);
            if (task.NodeID) {
              const system = systemsByNodeId?.get(task.NodeID);
              if (task && service && system && ctr?.container && ctr?.top) {
                const args = { task: task, service: service, system: system, container: ctr.container, top: ctr.top }
                const suppressionLabel = ctr.container?.Config?.Labels?.['swarmview.suppress']
                const issues: Issue[] = []
                checks.forEach(check => {                  
                  const result = evaluateCheck(check, suppressionLabel, args)
                  if (result.state != 'pass' && result.state != 'info') {
                    issues.push({check: check, result: result});
                  }
                })
                svc.issues = issues
                svc.issueCount = issues.length

                // If all services in this stack have issueCount, update stack count
                const allDone = stack.services.every(s => s.issueCount !== undefined);
                if (allDone) {
                  stack.issueCount = stack.services.reduce(
                    (sum, s) => sum + (s.issueCount ?? 0),
                    0
                  );
                }

                // Trigger minimal rerender
                setStacks([...stacks]);
              }
            }
          })
        }
      });
    });
  }, [props.docker, systemsByNodeId]);

  //
  // ─── Stack Columns ────────────────────────────────────────
  //
  const stackColumns = useMemo<MRT_ColumnDef<StackOverview>[]>(() => [
    { accessorKey: 'stack', header: 'Stack' },
    {
      header: 'Issues',
      Cell: ({ row }) => {
        const stack = row.original;
        return stack.issueCount === undefined
          ? <CircularProgress size={18} />
          : stack.issueCount;
      },
    },
  ], []);

  //
  // ─── Render ───────────────────────────────────────────────
  //
  console.log(stacks)
  return (
    <>
      <MaterialReactTable
        columns={stackColumns}
        data={stacks}
        enableExpanding
        enablePagination={false}
        enableBottomToolbar={false}
        renderDetailPanel={({ row }) => (
          <ServicesTable services={row.original.services} />
        )}
      />
    </>
  );
}

export function createStackOverviews(services: Service[]): StackOverview[] {
  let stackmap = services.reduce<Record<string, StackOverview>>((acc, svc) => {
    const stackName = svc.Spec?.Labels?.['com.docker.stack.namespace'] ?? 'unknown';

    // Create the stack entry if missing
    if (!acc[stackName]) {
      acc[stackName] = {
        stack: stackName,
        services: [],
        issueCount: undefined,   // pending
      };
    }

    // Push a new ServiceOverview entry
    acc[stackName].services.push({
      name: svc.Spec?.Name ?? '',
      id: svc.ID ?? '',
      issues: undefined,        // pending
      issueCount: undefined,    // pending
    });

    return acc;
  }, {})

  return Object.values(stackmap);
}
