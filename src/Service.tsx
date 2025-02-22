import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Containers, Service, SystemInfo, Task } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VisNetwork, { GraphData, Node, Edge } from './VisNetwork';
import LogsView from './LogsView';
import { DockerApi } from './DockerApi';
import KeyValueTable, { KeyValueTablePropsEntry, KeyValueTableValue } from './KeyValueTable';
import LabelsTable, { createLabels, LabelDetails } from './tables/LabelsTable';
import TasksTable, { createTaskDetails, TaskDetails } from './tables/TasksTable';
import SecretsTable, { buildServicesBySecret, createSecretDetails, SecretDetails } from './tables/SecretsTable';
import ConfigsTable, { buildServicesByConfig, ConfigDetails, createConfigDetails } from './tables/ConfigsTable';
import NetworkAttachmentsTable, { createNetworkAttachmentDetails, NetworkAttachmentDetails } from './tables/NetworkAttachmentsTable';
import SimpleTable from './SimpleTable';
import TaskChecks from './TaskChecks';

interface ServiceProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
type ServiceUiParams = {
  id: string;
};
function ServiceUi(props: ServiceProps) {

  const { id } = useParams<ServiceUiParams>();

  const [service, setService] = useState<Service | undefined>()
  const [tab, setTab] = useState(0)

  const [labelDetails, setLabelDetails] = useState<LabelDetails[]>([])
  const [networkDetails, setNetworkDetails] = useState<NetworkAttachmentDetails[]>([])
  const [configDetails, setConfigDetails] = useState<ConfigDetails[]>([])
  const [secretDetails, setSecretDetails] = useState<SecretDetails[]>([])
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])
  
  const [runningTasks, setRunningTasks] = useState<Task[]>([])
  const [mounts, setMounts] = useState<(string | undefined)[][]>([]) 
  const [resources, setResources] = useState<(string | number | null)[][]>([]) 
  const [ports, setPorts] = useState<(string | number | null | undefined)[][]>([]) 

  // Values for TaskChecks
  const [system, setSystem] = useState<SystemInfo | undefined>()
  const [container, setContainer] = useState<Containers.ContainerInspect.ResponseBody | undefined>()
  const [top, setTop] = useState<Containers.ContainerTop.ResponseBody | undefined>()


  const [reachGraph, setReachGraph] = useState<GraphData>({})

  useEffect(() => {
    Promise.all([
      props.docker.services()
      , props.docker.tasks()
      , props.docker.networks()
      , props.docker.configs()
      , props.docker.secrets()
      , props.docker.exposedPorts()
      , props.docker.nodesById()
    ]).then(value => {
      const services = value[0]
      const tasks = value[1]
      const networks = value[2]
      const configs = value[3]
      const secrets = value[4]
      const exposedPorts = value[5]
      const nodesById = value[6]

      // This repetition of docker.servicesById() avoids a race condition where that hits the network twice
      const servicesById = services.reduce((result, current) => {
        if (current.ID) {
          result.set(current.ID, current)
        }
        return result
      }, new Map<string, Service>())

      const svc = services.find(svc => { return svc.ID === id })
      setService(svc)
      props.setTitle('Service: ' + (svc?.Spec?.Name || id))

      let labels = [] as LabelDetails[]
      labels = createLabels(labels, svc?.Spec?.Labels, 'Service');
      labels = createLabels(labels, svc?.Spec?.TaskTemplate?.ContainerSpec?.Labels, 'Container');
      setLabelDetails(labels)

      if (service?.Spec?.TaskTemplate?.Networks) {
        setNetworkDetails(service?.Spec?.TaskTemplate?.Networks.reduce((result, current) => {
          if (current.Target) {
            const net = networks.find(n => n.Id = current.Target)
            if (net) {
              result.push(createNetworkAttachmentDetails(net, service?.Spec?.Networks?.find(nac => nac.Target == current.Target)))
            }
          }
          return result
        }, [] as NetworkAttachmentDetails[]))
      } else {
        setNetworkDetails([])
      }

      const nowMs = Date.now()
      
      const servicesByConfig = buildServicesByConfig(services)
      setConfigDetails(configs.reduce((result, current) => {
        svc?.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(svcCon => {
          if (svcCon.ConfigID === current.ID) {
            result.push(createConfigDetails(current, servicesByConfig, nowMs))
          }
        })
        return result
      }, [] as ConfigDetails[]))

      const servicesBySecret = buildServicesBySecret(services)
      setSecretDetails(secrets.reduce((result, current) => {
        svc?.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(svcCon => {
          if (svcCon.SecretID === current.ID) {
            result.push(createSecretDetails(current, servicesBySecret, nowMs))
          }
        })
        return result
      }, [] as ConfigDetails[]))

      setTaskDetails(tasks.reduce((result, current) => {
        if (current.ServiceID === id && current.ID) {
          result.push(createTaskDetails(current, servicesById, nodesById, exposedPorts, nowMs))

        }
        return result
      }, [] as TaskDetails[]))
      setRunningTasks(tasks.reduce((result, current) => {
        if (current.ServiceID === id && current.ID && current.Status?.State == 'running') {
          result.push(current)
        }
        return result
      }, [] as Task[]))

      setMounts(svc?.Spec?.TaskTemplate?.ContainerSpec?.Mounts?.map(mount => [ mount.Type, mount.Target, mount.Source, mount.ReadOnly ? 'true' : 'false' ]) || [])

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

      let ports = svc?.Endpoint?.Ports?.map(p => [String(p.Protocol), p.TargetPort, p.PublishedPort, p.PublishMode]) || []
      if (svc?.Spec?.TaskTemplate?.ContainerSpec?.Image) {
        const ep = exposedPorts[svc.Spec.TaskTemplate.ContainerSpec.Image.replace(/:.*@/, '@')]
        if (ep) {
          ports = ports?.concat(ep.map(p => [p.replace(/^[^/]*\//, ''), p.replace(/\/.*$/, ''), '', '']))
        }
      }
      setPorts(ports)

      if (services && networks && svc) {
        const nodes : Node[] = []
        const edges : Edge[] = []

        nodes.push({
          id: svc.ID
          , label: svc.Spec?.Name || svc.ID
          , group: 'base'
        })
        svc?.Spec?.TaskTemplate?.Networks?.forEach(net => {
          const netName = networks.find(n => n.Id == net.Target)?.Name || net?.Target
          nodes.push({
            id: net.Target
            , label: netName
            , shape: 'box'
            , group: netName
          })
          edges.push({
            from: svc.ID
            , to: net.Target
            , 
          })
          services.forEach(svc => {
            if (svc.ID !== service?.ID) {
              const svcnet = svc.Spec?.TaskTemplate?.Networks?.find(n => n.Target == net.Target)
              if (svcnet) {
                nodes.push({
                  id: svc?.ID +'@' + net.Target
                  , label: svc?.Spec?.Name || svc?.ID
                  , group: netName
                })
                edges.push({
                  from: net.Target
                  , to: svc?.ID +'@' + net.Target
                })
              }
            }
          })
        })
        setReachGraph({nodes: nodes, edges: edges})
      } else {
        setReachGraph({})
      }
    })
  }
    , [props, id])

  useEffect(() => {
    if (runningTasks && runningTasks.length > 0 && runningTasks[0].NodeID && runningTasks[0].ID) {
      Promise.all([
        props.docker.container(runningTasks[0].NodeID, runningTasks[0].ID)
        , props.docker.system(runningTasks[0].NodeID)
      ]).then(value => {
        setContainer(value[0].container)
        setTop(value[0].top)
        setSystem(value[1])
      })
    } else {
      setContainer(undefined)
      setTop(undefined)
      setSystem(undefined)
    }
  }, [runningTasks])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const reachOptions = {
    height: (500 * Math.log10(reachGraph.nodes?.length || 1)) + "px"
  };

  const reachEvents = {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    doubleClick: (params : any) => {
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

  if (!service) {
    return <></>
  } else {
    const overviewKVs = [
      ['ID', service.ID || '']
      , ['Image', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || ' ']
      , ['Hash', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/.*@/, '') || ' ']
      , ['Created', service.CreatedAt || '']
      , ['Updated', service.UpdatedAt || '']
      , ['Stack', service?.Spec?.Labels && service?.Spec?.Labels['com.docker.stack.namespace'] ? { link: '/stack/' + service?.Spec?.Labels['com.docker.stack.namespace'], value: service?.Spec?.Labels['com.docker.stack.namespace'] } : '']
    ] as KeyValueTableValue[][]
    if (service?.Spec?.Labels) {
      const labelRe = /traefik.http.routers.[^.]+.rule/
      const hostRe = /Host\(`([^`]+)`\)/gi
      const result = [] as KeyValueTablePropsEntry[]
      Object.entries(service?.Spec?.Labels).forEach(e => {
        if (labelRe.test(e[0])) {
          let match
          while(match = hostRe.exec(e[1])) {
            const proto = match[1].includes('.lb.') ? 'http://' : 'https://'
            result.push({link: proto + match[1], value: proto + match[1] })
          }
        }
      })
      if (result.length > 0) {
        overviewKVs.push(['Ingress', result])
      }
    }
  
    return (
      <Box sx={{ width: '100%', height: '100%'}} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="Task tabs: Details, Logs, Raw">
          <Tab label="Details" />
          <Tab label="Checks" />
          <Tab label="Logs" />
          <Tab label="Raw" />
          </Tabs>
        </Box>
        {
          tab === 0 &&
          <Box sx={{height: '100%'}}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Section id="service.overview" heading="Overview" >
                  <KeyValueTable id="service.overview.table" kvTable={true} rows={overviewKVs}>
                  </KeyValueTable>
                </Section>
                <Section id="service.execution" heading="Execution" xs={6} >
                  <KeyValueTable id="service.execution.table" kvTable={true} rows={
                    [
                      ['Command', service?.Spec?.TaskTemplate?.ContainerSpec?.Command]
                      , ['Arguments', service?.Spec?.TaskTemplate?.ContainerSpec?.Args]
                      , ['Environment', service?.Spec?.TaskTemplate?.ContainerSpec?.Env]
                      , ['Dir', service?.Spec?.TaskTemplate?.ContainerSpec?.Dir]
                      , ['User', service?.Spec?.TaskTemplate?.ContainerSpec?.User]
                      , ['Groups', service?.Spec?.TaskTemplate?.ContainerSpec?.Groups]
                      , ['Hostname', service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname]
                    ]
                  }>
                  </KeyValueTable>
                </Section>
                <Section id="service.resources" heading="Resources" >
                  <KeyValueTable id="service.resources.table" kvTable={true} rows={resources}>
                  </KeyValueTable>
                </Section>
                <Section id="service.status" heading="Status" >
                  <KeyValueTable id="service.status.table" kvTable={true} rows={
                    [
                      ['Running Tasks', service.ServiceStatus?.RunningTasks]
                      , ['Desired Takss', service.ServiceStatus?.DesiredTasks]
                      , ['Completed Tasks', service.ServiceStatus?.CompletedTasks]
                    ]
                  }>
                  </KeyValueTable>
                </Section>
                <Section id="service.mounts" heading="Mounts" >
                  <KeyValueTable id="service.mounts.spec" kvTable={true} sx={{ width: '20em' }} rows={
                    [
                      ['Read Only Root FS', String(service?.Spec?.TaskTemplate?.ContainerSpec?.ReadOnly)]
                    ]
                  }>
                  </KeyValueTable>
                  <br />
                  <SimpleTable id="service.mounts.list" headers={
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
                <Section id="service.ports" heading="Ports" >
                  <SimpleTable id="service.ports.list" headers={
                    [
                      'Type'
                      , 'Target'
                      , 'Published'
                      , 'Mode'
                    ]
                  } rows={ports}
                  >
                  </SimpleTable>
                </Section>

                <Section id="service.labels" heading="Labels" >
                  <LabelsTable id="service.labels.table" labels={labelDetails} />
                </Section>

                <Section id="service.networks" heading="Networks" xs={12} >
                  <NetworkAttachmentsTable id="service.networks.table" networks={networkDetails} />
                </Section>

                <Section id="service.reach" heading="Reach" xs={12} >
                  <VisNetwork
                    data={reachGraph}
                    options={reachOptions}
                    events={reachEvents}
                  />
                </Section>

                  <Section id="service.configs" heading="Configs" xs={12}>
                    <ConfigsTable id="service.configs.table" configs={configDetails} />
                  </Section>

                  <Section id="service.secrets" heading="Secrets" xs={12}>
                    <SecretsTable id="service.secrets.table" secrets={secretDetails} />
                  </Section>

                  <Section id="service.tasks" heading="Tasks" xs={12}>
                    <TasksTable id="service.tasks.table" tasks={taskDetails} />
                  </Section>

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <Box sx={{height: '100%'}}>
            <Box sx={{ flexGrow: 1 }}>
            {
              (runningTasks.length <= 0) &&
                <Grid container spacing={2}>
                  <Section id="service.checks.overview" heading="Overview" >
                    This service has {runningTasks.length} running tasks, checks require running tasks.
                  </Section>
                </Grid>
            }
            {
              (runningTasks.length == 1) &&
                <Grid container spacing={2}>
                  <Section id="service.checks.overview" heading="Overview" >
                    This service has {runningTasks.length} running tasks, checks require running tasks.
                  </Section>

                  <TaskChecks task={runningTasks[0]} service={service} system={system} container={container} top={top} />
                </Grid>
            }
            {
              (runningTasks.length > 1) &&
                <Grid container spacing={2}>
                  <Section id="service.checks.overview" heading="Overview" >
                    This service has {runningTasks.length} running tasks, checks are carried out using task {runningTasks[0].ID}.
                    Please check specific tasks from the table below.
                  </Section>

                  <Section id="service.tasks" heading="Tasks" xs={12}>
                    <TasksTable id="service.tasks.table" tasks={taskDetails} />
                  </Section>

                  <TaskChecks task={runningTasks[0]} service={service} system={system} container={container} top={top} />
                </Grid>
            }
            </Box>
          </Box>
        }
        {
          tab === 2 &&
          <LogsView
            logsUrl={props.baseUrl + 'services/' + id + '/logs'}
            id='tasks.logs' 
            />
        }
        {
          tab === 3 &&
          <Box>
            <JSONPretty data={service} />
          </Box>
        }
      </Box >
    )
  }

}

export default ServiceUi;