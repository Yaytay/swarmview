import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Task, Node, SystemInfo, Service, Containers, Network } from './docker-schema';
import { useParams } from 'react-router-dom';
import Section from './Section';
import { Tabs, Tab } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import VisNetwork, { GraphData, Node as NetworkNode, Edge } from './VisNetwork';
import LogsView from './LogsView';
import TaskChecks from './TaskChecks';
import { DockerApi } from './DockerApi';
import KeyValueTable from './KeyValueTable';
import SimpleTable from './SimpleTable';
import LabelsTable, { LabelDetails, createLabels } from './tables/LabelsTable';
import NetworkAttachmentsTable, { createNetworkAttachmentDetails, NetworkAttachmentDetails } from './tables/NetworkAttachmentsTable';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';

interface TaskUiProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi  
  refresh: Date
}
type TaskUiParams = {
  id: string;
};
function TaskUi(props: TaskUiProps) {
  const { id } = useParams<TaskUiParams>();

  const [labelDetails, setLabelDetails] = useState<LabelDetails[]>([])
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])
  const [networkDetails, setNetworkDetails] = useState<NetworkAttachmentDetails[]>([])

  const [task, setTask] = useState<Task | undefined>()
  const [service, setService] = useState<Service | undefined>()

  const [nodes, setNodes] = useState<Map<string, Node>>(new Map())

  const [system, setSystem] = useState<SystemInfo | undefined>()
  const [container, setContainer] = useState<Containers.ContainerInspect.ResponseBody | undefined>()
  const [top, setTop] = useState<Containers.ContainerTop.ResponseBody | undefined>()
  const [networksById, setNetworksById] = useState<Map<string, Network>>()

  const [tab, setTab] = useState(0)

  const [mounts, setMounts] = useState<(string | undefined)[][]>([])
  const [resources, setResources] = useState<(string | number | null)[][]>([])
  const [reachGraph, setReachGraph] = useState<GraphData>({})

  useEffect(() => {
    Promise.all([
      props.docker.tasks()
      , props.docker.servicesById()
      , props.docker.networksById()
      , props.docker.nodesById()
      , props.docker.exposedPorts()      
    ]).then(value => {
      const tasks = value[0]
      const servicesById = value[1]
      const netsById = value[2]
      const nodesById = value[3]
      const exposedPorts = value[4]

      setNetworksById(netsById)
      const tsk = tasks.find(tsk => { return tsk.ID === id })
      setTask(tsk)
      const title = 'Task: ' + (tsk ? ((tsk.ServiceID && servicesById.get(tsk.ServiceID)?.Spec?.Name) ?? tsk.ServiceID) + '.' + (tsk.Slot ? tsk.Slot : tsk.NodeID) : id)
      props.setTitle(title)
      setNodes(nodesById)
      if (tsk?.ServiceID) {
        setService(servicesById.get(tsk.ServiceID))
      }

      let labels = [] as LabelDetails[]
      labels = createLabels(labels, task?.Labels, 'Task');
      labels = createLabels(labels, task?.Spec?.ContainerSpec?.Labels, 'Container');
      setLabelDetails(labels)

      const service = task?.ServiceID ? servicesById.get(task?.ServiceID) : undefined
      
      setNetworkDetails(task?.Spec?.Networks?.reduce((result, current) => {
        if (current.Target) {
          const net = netsById.get(current.Target)          
          if (net) {
            result.push(
              createNetworkAttachmentDetails(
                net
                , service?.Spec?.TaskTemplate?.Networks?.find(nac => nac.Target === current.Target)
                , container?.NetworkSettings?.Networks ? container.NetworkSettings.Networks[net.Name || '']?.IPAddress : ''
              )
            )
          }
        }
        return result
      }, [] as NetworkAttachmentDetails[]) || [])

      if (service) {
        setServiceDetails([createServiceDetails(service, exposedPorts)])
      }

      if (servicesById && netsById && task) {
        const nodes: NetworkNode[] = []
        const edges: Edge[] = []

        nodes.push({
          id: service?.ID || task.ID
          , label: service?.Spec?.Name || service?.ID || task.ID
          , group: 'base'
        })
        service?.Spec?.TaskTemplate?.Networks?.forEach(net => {
          const netName = netsById.get(net.Target || '')?.Name || net.Target
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
          
          servicesById.forEach(svc => {
            if (svc.ID !== service.ID) {
              const svcnet = svc?.Spec?.TaskTemplate?.Networks?.find(n => n.Target === net.Target)
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
      } else {
        setReachGraph({})
      }

      setMounts(task?.Spec?.ContainerSpec?.Mounts?.map(mount => [ mount.Type, mount.Target, mount.Source, mount.ReadOnly ? 'true' : 'false' ]) || [])

      const buildResources = [] as (string | number | null)[][]
      if (service?.Spec?.TaskTemplate?.Resources) {
        const res = service.Spec.TaskTemplate.Resources
        buildResources.push(['Limit Memory', (res.Limits?.MemoryBytes ? String(res.Limits?.MemoryBytes / 1048576) + 'MB' : null)])
        buildResources.push(['Limit CPUs', (res.Limits?.NanoCPUs ? res.Limits?.NanoCPUs / 1000000000 : null)])
        buildResources.push(['Limit PIDs', res.Limits?.Pids ?? null])
        buildResources.push(['Reserve Memory', (res.Reservations?.MemoryBytes ? String(res.Reservations?.MemoryBytes / 1048576) + 'MB' : null)])
        buildResources.push(['Reserve CPUs', (res.Reservations?.NanoCPUs ? res.Reservations?.NanoCPUs / 1000000000 : null)])
      }
      service?.Spec?.TaskTemplate?.ContainerSpec?.Ulimits?.forEach(ulimit => {
        buildResources.push(['ULimit: ' + ulimit.Name, ulimit.Soft + ' : ' + ulimit.Hard])
      })      
      setResources(buildResources)

      if (task && task.ID && task.NodeID && (task.Status?.State == 'running')) {
        Promise.all([
          props.docker.container(task.NodeID, task.ID)
          , props.docker.system(task.NodeID)
        ]).then(value => {
          setContainer(value[0].container)
          setTop(value[0].top)
          setSystem(value[1])

        })
      }
    })
  }, [props, id])

  useEffect(() => {
    setNetworkDetails(task?.Spec?.Networks?.reduce((result, current) => {
      if (current.Target) {
        const net = networksById?.get(current.Target)          
        if (net) {
          result.push(
            createNetworkAttachmentDetails(
              net
              , service?.Spec?.TaskTemplate?.Networks?.find(nac => nac.Target === current.Target)
              , container?.NetworkSettings?.Networks ? container.NetworkSettings.Networks[net.Name || '']?.IPAddress : ''
            )
          )
        }
      }
      return result
    }, [] as NetworkAttachmentDetails[]) || [])    
  }, [task, service, networksById, container])

  const reachOptions = {
    height: (500 * Math.log10(reachGraph.nodes?.length || 1)) + "px"
  };

  const reachEvents = {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
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
      <Box sx={{ width: '100%', height: '99%', display: 'flex', flexFlow: 'column'}}  >
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
                  <KeyValueTable id="task.overview.table" rows={
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
                  </KeyValueTable>
                </Section>
                <Section id="task.execution" heading="Execution" xs={6} >
                  <KeyValueTable id="task.execution.table" rows={
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
                  </KeyValueTable>
                </Section>
                <Section id="task.resources" heading="Resources" >
                  <KeyValueTable id="task.resources.table" rows={resources}>
                  </KeyValueTable>
                </Section>
                <Section id="task.status" heading="Status" >
                  <KeyValueTable id="task.status.table" rows={
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
                  </KeyValueTable>
                </Section>
                <Section id="task.mounts" heading="Mounts" >
                  <KeyValueTable id="task.mounts.spec" sx={{ width: '20em' }} rows={
                    [
                      ['Read Only Root FS', String(task?.Spec?.ContainerSpec?.ReadOnly)]
                    ]
                  }>
                  </KeyValueTable>
                  <br />
                  <SimpleTable id="task.mounts.list" headers={
                    [
                      'Type'
                      , 'Target'
                      , 'Source'
                      , 'ReadOnly'
                    ]
                  } rows={mounts}
                  >
                  </SimpleTable>
                </Section>

                <Section id="task.labels" heading="Labels" >
                  <LabelsTable id="task.labels.table" labels={labelDetails} />
                </Section>

                <Section id="task.service" heading="Service" xs={12} >
                  <ServicesTable id="task.service.table" services={serviceDetails} />
                </Section>

                <Section id="task.networks" heading="Networks" xs={12} >
                  <NetworkAttachmentsTable id="task.networks.table" networks={networkDetails} />
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
          <TaskChecks task={task} service={service} system={system} container={container} top={top} />
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
