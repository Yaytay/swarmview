import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Network, Service, Task, Node, SystemInfo, ContainerConfig } from './docker-schema';
import { useParams } from 'react-router-dom';
import Section from './Section';
import { Tabs, Tab } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import VisNetwork, { GraphData, Node as NetworkNode, Edge } from './VisNetwork';
import LogsView from './LogsView';
import TaskChecks from './TaskChecks';

interface TaskUiProps {
  baseUrl: string
  setTitle: (title: string) => void
}
type TaskUiParams = {
  id: string;
};
function TaskUi(props: TaskUiProps) {
  const { id } = useParams<TaskUiParams>();

  const [system, setSystem] = useState<SystemInfo | undefined>()
  const [container, setContainer] = useState<ContainerConfig | undefined>()
  const [services, setServices] = useState<Map<string, Service>>(new Map())
  const [servicesByNetwork, setServicesByNetwork] = useState<Map<string, Service[]>>(new Map())
  const [networks, setNetworks] = useState<Map<string, Network>>(new Map())
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map())
  const [task, setTask] = useState<Task | null>(null)
  const [tab, setTab] = useState(0)

  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])

  const [mounts, setMounts] = useState<(string | undefined)[][]>([])
  const [resources, setResources] = useState<(string | number | null)[][]>([])
  const [networksData, setNetworksData] = useState<(DataTableValue)[][]>([])
  const [reachGraph, setReachGraph] = useState<GraphData>({})

  useEffect(() => {
    fetch(props.baseUrl + 'services')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get services:', reason)
      })
      .then(j => {
        const baseServices = j as Service[]
        const buildServices = new Map<string, Service>()
        const buildServicesByNet = new Map<string, Service[]>()
        baseServices.forEach(svc => {
          if (svc.ID) {
            buildServices.set(svc.ID, svc)
          }
          if (svc?.Spec?.TaskTemplate?.Networks) {
            svc?.Spec?.TaskTemplate?.Networks.forEach(net => {
              if (net.Target) {
                let netList = buildServicesByNet.get(net.Target)
                if (!netList) {
                  netList = []
                  buildServicesByNet.set(net.Target, netList)
                }
                netList.push(svc)
              }
            })
          }
        })
        setServices(buildServices)
        setServicesByNetwork(buildServicesByNet)
      })

    fetch(props.baseUrl + 'networks')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get networks:', reason)
      })
      .then(j => {
        const baseNetworks = j as Network[]
        const buildNetworks = new Map<string, Network>()
        baseNetworks.forEach(net => {
          if (net.Id) {
            buildNetworks.set(net.Id, net)
          }
        })
        setNetworks(buildNetworks)
      })

    fetch(props.baseUrl + 'nodes')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get nodes:', reason)
      })
      .then(j => {
        const baseNodes = j as Node[]
        const buildNodes = new Map<string, Node>()
        baseNodes.forEach(nod => {
          if (nod.ID) {
            buildNodes.set(nod.ID, nod)
          }
        })
        setNodes(buildNodes)
      })

    fetch(props.baseUrl + 'tasks/' + id)
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get tasks:', reason)
      })
      .then(j => {
        setTask(j)
      })
  }
    , [props.baseUrl, id])


  useEffect(() => {
    if (task) {
      props.setTitle('Task: ' + ((task.ServiceID && services.get(task.ServiceID)?.Spec?.Name) ?? task.ServiceID) + '.' + (task.Slot ? task.Slot : task.NodeID))

      const buildLabels = [] as (string | number | DataTablePropsEntry)[][]
      if (task?.Spec?.ContainerSpec?.Labels) {
        const record = task?.Spec?.ContainerSpec?.Labels
        Object.keys(record).forEach(key => {
          if (record[key]) {
            buildLabels.push([key, record[key], 'ContainerSpec'])
          }
        })
      }
      setLabels(buildLabels)

      let buildMounts = [] as (string | undefined)[][]
      if (task?.Spec?.ContainerSpec?.Mounts) {
        buildMounts = task.Spec.ContainerSpec.Mounts.map(mount => {
          return [
            mount.Type
            , mount.Target
            , mount.Source
            , mount.ReadOnly ? 'true' : 'false'
          ]
        })
        setMounts(buildMounts)
      }

      if (task?.Spec?.Networks) {
        const buildNetworks = task.Spec.Networks.reduce<(DataTableValue)[][]>((accumulator, svcNet) => {
          if (svcNet.Target) {
            const net = networks.get(svcNet.Target)

            const netServices: DataTablePropsEntry[] = []
            const svcsOnNet = servicesByNetwork.get(svcNet.Target)
            svcsOnNet?.sort().forEach(svcOnNet => {
              if (svcOnNet.ID) {
                netServices.push({ link: '/service/' + svcOnNet.ID, value: svcOnNet.Spec?.Name || svcOnNet.ID })
              }
            })

            if (net && svcNet.Target) {
              const item = [
                { link: '/network/' + svcNet.Target, value: svcNet.Target }
                , net?.Name
                , svcNet.Aliases
                , JSON.stringify(net?.Options)
                , netServices
              ]
              accumulator.push(item)
            }
          }
          return accumulator
        }, [])
        setNetworksData(buildNetworks)

        if (services && networks) {
          const nodes: NetworkNode[] = []
          const edges: Edge[] = []

          const service = services.get(task.ServiceID || '')

          nodes.push({
            id: service?.ID || task.ID
            , label: service?.Spec?.Name || service?.ID || task.ID
            , group: 'base'
          })
          service?.Spec?.TaskTemplate?.Networks?.forEach(net => {
            const netName = networks.get(net.Target || '')?.Name || net.Target
            nodes.push({
              id: net.Target
              , label: netName
              , shape: 'box'
              , group: netName
            })
            edges.push({
              from: service?.ID || task.ID
              , to: net.Target
              ,
            })
            services.forEach(svc => {
              if (svc.ID !== service.ID) {
                const svcnet = svc.Spec?.TaskTemplate?.Networks?.find(n => n.Target == net.Target)
                if (svcnet) {
                  nodes.push({
                    id: svc?.ID + '@' + net.Target
                    , label: svc?.Spec?.Name || svc?.ID
                    , group: netName
                  })
                  edges.push({
                    from: net.Target
                    , to: svc?.ID + '@' + net.Target
                  })
                }
              }
            })
          })

          setReachGraph({ nodes: nodes, edges: edges })
        }


      } else {
        setNetworksData([])
        setReachGraph({})
      }

      const buildResources = [] as (string | number | null)[][]
      if (task?.Spec?.Resources) {
        const res = task.Spec.Resources
        buildResources.push(['Limit Memory', (res.Limits?.MemoryBytes ? String(res.Limits?.MemoryBytes / 1048576) + 'MB' : null)])
        buildResources.push(['Limit CPUs', (res.Limits?.NanoCPUs ? res.Limits?.NanoCPUs / 1000000000 : null)])
        buildResources.push(['Limit PIDs', res.Limits?.Pids ?? null])
        buildResources.push(['Reserve Memory', (res.Reservations?.MemoryBytes ? String(res.Reservations?.MemoryBytes / 1048576) + 'MB' : null)])
        buildResources.push(['Reserve CPUs', (res.Reservations?.NanoCPUs ? res.Reservations?.NanoCPUs / 1000000000 : null)])
      }
      task?.Spec?.ContainerSpec?.Ulimits?.forEach(ulimit => {
        buildResources.push(['ULimit: ' + ulimit.Name, ulimit.Soft + ' : ' + ulimit.Hard])
      })
      setResources(buildResources)

    }
  }, [id, task, networks, nodes, services, props, servicesByNetwork])

  useEffect(() => {
    if (task && !system) {
      fetch('/api/system/' + task.NodeID)
        .then(r => r.json())
        .then(j => setSystem(j))
        .catch(ex => console.log('Failed to get system info: ', ex))
    }
    if (task && !container && task.NodeID && task.ID) {
      fetch('/api/container/' + task.NodeID + '/' + task.ID)
        .then(r => r.json())
        .then(j => setContainer(j))
        .catch(ex => console.log('Failed to get container details: ', ex))
    }
  }, [task])

  const reachOptions = {
    height: (500 * Math.log10(reachGraph.nodes?.length || 1)) + "px"
  };

  const reachEvents = {
    doubleClick: (params: any) => {
      console.log(params)
      if (params.nodes.length == 1) {
        if (params.nodes[0].includes('@')) {
          console.log('Service: ' + params.nodes[0].replace(/@.*/, ''))
          window.open('/service/' + params.nodes[0].replace(/@.*/, ''))
        } else {
          console.log('Network: ' + params.nodes[0])
          window.open('/network/' + params.nodes[0])
        }
      }
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!task) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%', height: '99%', display: 'flex', flexFlow: 'column' }}  >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 1 auto' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Details" />
            <Tab label="Logs" />
            <Tab label="Checks" />
            <Tab label="Raw" />
          </Tabs>
        </Box>
        {
          tab === 0 &&
          <Box sx={{ flex: '1 1 auto' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} >
                <Section id="task.overview" heading="Overview" >
                  <DataTable id="task.overview.table" kvTable={true} rows={
                    [
                      ['ID', task.ID || '']
                      , ['Image', task?.Spec?.ContainerSpec?.Image?.replace(/@.*/, '') || ' ']
                      , ['Hash', task.Spec?.ContainerSpec?.Image?.replace(/.*@/, '') || ' ']
                      , ['Created', task.CreatedAt || '']
                      , ['Updated', task.UpdatedAt || '']
                      , ['Stack', task?.Spec?.ContainerSpec?.Labels && task?.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'] ? { link: '/stack/' + task?.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'], value: task?.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'] } : '']
                      , ['Node', { link: '/node/' + task.NodeID, value: (nodes && task.NodeID && nodes.get(task.NodeID)?.Description?.Hostname || task.NodeID || '') }]
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="task.execution" heading="Execution" xs={6} >
                  <DataTable id="task.execution.table" kvTable={true} rows={
                    [
                      ['Command', task?.Spec?.ContainerSpec?.Command]
                      , ['Arguments', task?.Spec?.ContainerSpec?.Args]
                      , ['Environment', task?.Spec?.ContainerSpec?.Env]
                      , ['Dir', task?.Spec?.ContainerSpec?.Dir]
                      , ['User', task?.Spec?.ContainerSpec?.User]
                      , ['Groups', task?.Spec?.ContainerSpec?.Groups]
                      , ['Hostname', task?.Spec?.ContainerSpec?.Hostname]
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="task.resources" heading="Resources" >
                  <DataTable id="task.resources.table" kvTable={true} rows={resources}>
                  </DataTable>
                </Section>
                <Section id="task.status" heading="Status" >
                  <DataTable id="task.status.table" kvTable={true} rows={
                    [
                      ['Timestamp', task.Status?.Timestamp || '']
                      , ['State', task.Status?.State || '']
                      , ['Desired State', task.DesiredState || '']
                      , ['Message', task.Status?.Message || '']
                      , ['Container ID', task.Status?.ContainerStatus?.ContainerID || '']
                      , ['PID', task.Status?.ContainerStatus?.PID || '']
                      , ['ExitCode', task.Status?.ContainerStatus?.ExitCode || '']
                      , ['Port Status', task.Status?.PortStatus ? JSON.stringify(task.Status?.PortStatus) : '']
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="task.mounts" heading="Mounts" >
                  <DataTable id="task.mounts.spec" kvTable={true} sx={{ width: '20em' }} rows={
                    [
                      ['Read Only Root FS', String(task?.Spec?.ContainerSpec?.ReadOnly)]
                    ]
                  }>
                  </DataTable>
                  <br />
                  <DataTable id="task.mounts.list" headers={
                    [
                      'Type'
                      , 'Target'
                      , 'Source'
                      , 'ReadOnly'
                    ]
                  } rows={mounts}
                  >
                  </DataTable>
                </Section>

                <Section id="task.labels" heading="Labels" >
                  <DataTable id="task.labels.table" headers={
                    [
                      'Label'
                      , 'Value'
                      , 'Source'
                    ]
                  } rows={labels}
                  >
                  </DataTable>
                </Section>

                <Section id="task.networks" heading="Networks" xs={12} >
                  <DataTable id="task.networks.table" headers={
                    [
                      'ID'
                      , 'Name'
                      , 'Aliases'
                      , 'Options'
                      , 'Services'
                    ]
                  } rows={networksData}
                  >
                  </DataTable>
                </Section>

                <Section id="tasks.reach" heading="Reach" xs={12} >
                  <VisNetwork
                    data={reachGraph}
                    options={reachOptions}
                    events={reachEvents}
                  />
                </Section>

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <LogsView
            logsUrl={props.baseUrl + 'tasks/' + id + '/logs'}
            id='tasks.logs'
          />
        }
        {
          tab === 2 &&
          <TaskChecks task={task} system={system} />
        }
        {
          tab === 3 &&
          <Box>
            <JSONPretty data={task} />
          </Box>
        }
      </Box >
    )
  }

}

export default TaskUi;