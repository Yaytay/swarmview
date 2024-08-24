import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Service, Network, Task, Secret, Config } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';
import VisNetwork, { GraphData, Node, Edge } from './VisNetwork';
import LogsView from './LogsView';
import { DockerApi } from './DockerApi';

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

  const [service, setService] = useState<Service | null>(null)
  const [tab, setTab] = useState(0)

  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])
  const [mounts, setMounts] = useState<(string | undefined)[][]>([])
  const [resources, setResources] = useState<(string | number | null)[][]>([])
  const [services, setServices] = useState<Service[]>([])
  const [networks, setNetworks] = useState<Network[]>([])
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [configs, setConfigs] = useState<Config[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [networksData, setNetworksData] = useState<(DataTableValue)[][]>([])
  const [reachGraph, setReachGraph] = useState<GraphData>({})
  const [ports, setPorts] = useState<(DataTableValue)[][]>([])
  const [svcConfigs, setSvcConfigs] = useState<DataTableValue[][]>([])
  const [svcSecrets, setSvcSecrets] = useState<DataTableValue[][]>([])
  const [exposedPorts, setExposedPorts] = useState<Record<string, string[]>>()

  const [svcTasks, setSvcTasks] = useState<DataTableValue[][]>([])
  const [svcTaskHeaders, setSvcTaskHeaders] = useState<string[]>([])

  useEffect(() => {
    props.docker.tasks()
      .then(j => {
        setTasks(j)
      })
    props.docker.networks()
      .then(j => {
        setNetworks(j as Network[])
      })
    props.docker.secrets()
      .then(j => {
        setSecrets(j)
      })
    props.docker.configs()
      .then(j => {
        setConfigs(j)
      })
    props.docker.exposedPorts()
      .then(ports => {
        setExposedPorts(ports)
      })
    props.docker.services()
      .then(j => {
        setServices(j)
        const buildService = (j as Service[]).find(svc => { return svc.ID === id })
        console.log(buildService)
        if (!buildService) {
          console.log('Service ' + id + ' not found in ', j)
        } else {
          setService(buildService)
          props.setTitle('Service: ' + buildService.Spec?.Name)
          const buildLabels = [] as (string | number | DataTablePropsEntry)[][]
          if (buildService?.Spec?.Labels) {
            const record = buildService?.Spec?.Labels
            Object.keys(record).forEach(key => {
              if (record[key]) {
                buildLabels.push([key, record[key], 'Service'])
              }
            })
          }
          if (buildService?.Spec?.TaskTemplate?.ContainerSpec?.Labels) {
            const record = buildService?.Spec?.TaskTemplate?.ContainerSpec?.Labels
            Object.keys(record).forEach(key => {
              if (record[key]) {
                buildLabels.push([key, record[key], 'Container'])
              }
            })
          }
          setLabels(buildLabels)

          let buildMounts = [] as (string | undefined)[][]
          if (buildService?.Spec?.TaskTemplate?.ContainerSpec?.Mounts) {
            buildMounts = buildService.Spec.TaskTemplate.ContainerSpec.Mounts.map(mount => {
              return [
                mount.Type
                , mount.Target
                , mount.Source
                , mount.ReadOnly ? 'true' : 'false'
              ]
            })
            setMounts(buildMounts)
          }
        }
      })
  }
    , [props, id])

  useEffect(() => {
    if (service?.Spec?.TaskTemplate?.Networks) {

      const buildNetworks = service.Spec.TaskTemplate.Networks.reduce<(DataTableValue)[][]>((accumulator, svcNet) => {
        const net = networks?.find(n => n.Id === svcNet.Target)
        if (net && svcNet.Target) {
          const item = [
            { link: '/network/' + svcNet.Target, value: svcNet.Target }
            , net?.Name
            , svcNet.Aliases
            , JSON.stringify(net?.Options)
            , service.Endpoint?.VirtualIPs?.reduce((acc, val) => {
              if (val.NetworkID == net.Id && val.Addr) {
                acc.push(val.Addr)
              }
              return acc
            }, [] as string[]).join(', ')
          ]
          accumulator.push(item)
        }
        return accumulator
      }, [])

      setNetworksData(buildNetworks)

      if (services && networks) {
        const nodes : Node[] = []
        const edges : Edge[] = []

        nodes.push({
          id: service.ID
          , label: service.Spec?.Name || service.ID
          , group: 'base'
        })
        service?.Spec?.TaskTemplate?.Networks.forEach(net => {
          const netName = networks.find(n => n.Id == net.Target)?.Name || net?.Target
          nodes.push({
            id: net.Target
            , label: netName
            , shape: 'box'
            , group: netName
          })
          edges.push({
            from: service.ID
            , to: net.Target
            , 
          })
          services.forEach(svc => {
            if (svc.ID !== service.ID) {
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
      }
    }



    const buildPorts = [] as (DataTableValue)[][]
    service?.Endpoint?.Ports?.forEach(p => {
      buildPorts.push([
        p.Protocol
        , p.TargetPort
        , p.PublishedPort
        , p.PublishMode
      ])

    })
    if (exposedPorts && service?.Spec?.TaskTemplate?.ContainerSpec?.Image) {
      exposedPorts[service.Spec.TaskTemplate.ContainerSpec.Image.replace(/:.*@/, '@')]?.forEach(p => {
        buildPorts.push([
          p.replace(/^[^/]*\//, '')
          , p.replace(/\/.*$/, '')
          , ''
          , ''
        ])
      })

    }

    setPorts(buildPorts)

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

    if (service && tasks) {
      setSvcTaskHeaders(['ID', 'NAME', 'NODE', 'CREATED', 'IMAGE', 'DESIRED STATE', 'CURRENT STATE', 'ERROR', 'PORTS'])
      const buildStackTasks: DataTableValue[][] = []
      const nodeTasks = tasks.filter(tsk => tsk.ServiceID === id)
      nodeTasks.sort((l, r) => {
        return (l.CreatedAt ?? '') > (r.CreatedAt ?? '') ? -1 : 1
      })
      nodeTasks.forEach((tsk) => {
        if (tsk.ID) {
          buildStackTasks.push(
            [
              { link: '/task/' + tsk.ID, value: tsk.ID }
              , ((tsk.ServiceID && service.Spec?.Name) ?? tsk.ServiceID) + '.' + (tsk.Slot ? tsk.Slot : tsk.NodeID)
              , { link: '/node/' + tsk.NodeID, value: tsk.NodeID || '' }
              , tsk.CreatedAt
              , tsk?.Spec?.ContainerSpec?.Image?.replace(/@.*/, '')
              , tsk?.DesiredState
              , tsk?.Status?.State
              , tsk?.Status?.Err
              , tsk?.Status?.PortStatus?.Ports?.map(portSpec => {
                return portSpec.PublishedPort + ':' + portSpec.TargetPort
              })
              ,
            ]
          )
        }
      })
      setSvcTasks(buildStackTasks)
    }

    if (service && configs) {
      const svcCons: DataTableValue[][] = []
      configs.forEach(con => {
        service.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(svcCon => {
          if (svcCon.ConfigID === con.ID) {
            svcCons.push(
              [
                { link: '/config/' + con.ID, value: con.Spec?.Name || con.ID || '' }
                , svcCon.File?.Name
                , svcCon.File?.UID + ':' + svcCon.File?.GID
              ]
            )
          }
        })
      })
      setSvcConfigs(svcCons)
    }

    if (service && secrets) {
      const svcSecs: DataTableValue[][] = []
      secrets.forEach(sec => {
        service.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(svcSec => {
          if (svcSec.SecretID === sec.ID) {
            svcSecs.push(
              [
                { link: '/secret/' + sec.ID, value: sec.Spec?.Name || sec.ID || '' }
                , svcSec.File?.Name
                , svcSec.File?.UID + ':' + svcSec.File?.GID
              ]
            )
          }
        })
      })
      setSvcSecrets(svcSecs)
    }

  }, [service, networks, tasks, secrets, configs, id, services, exposedPorts])

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
    return (
      <Box sx={{ width: '100%', height: '100%'}} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="Task tabs: Details, Logs, Raw">
          <Tab label="Details" />
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
                  <DataTable id="service.overview.table" kvTable={true} rows={
                    [
                      ['ID', service.ID || '']
                      , ['Image', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || ' ']
                      , ['Hash', service?.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/.*@/, '') || ' ']
                      , ['Created', service.CreatedAt || '']
                      , ['Updated', service.UpdatedAt || '']
                      , ['Stack', service?.Spec?.Labels && service?.Spec?.Labels['com.docker.stack.namespace'] ? { link: '/stack/' + service?.Spec?.Labels['com.docker.stack.namespace'], value: service?.Spec?.Labels['com.docker.stack.namespace'] } : '']
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="service.execution" heading="Execution" xs={6} >
                  <DataTable id="service.execution.table" kvTable={true} rows={
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
                  </DataTable>
                </Section>
                <Section id="service.resources" heading="Resources" >
                  <DataTable id="service.resources.table" kvTable={true} rows={resources}>
                  </DataTable>
                </Section>
                <Section id="service.status" heading="Status" >
                  <DataTable id="service.status.table" headers={
                    [
                      'Running Tasks'
                      , 'Desired Tasks'
                      , 'Completed Tasks'
                    ]
                  }
                    rows={
                      [
                        [
                          service.ServiceStatus?.RunningTasks || ''
                          , service.ServiceStatus?.RunningTasks || ''
                          , service.ServiceStatus?.RunningTasks || ''
                        ]
                      ]
                    }>
                  </DataTable>
                </Section>
                <Section id="service.mounts" heading="Mounts" >
                  <DataTable id="service.mounts.spec" kvTable={true} sx={{ width: '20em' }} rows={
                    [
                      ['Read Only Root FS', String(service?.Spec?.TaskTemplate?.ContainerSpec?.ReadOnly)]
                    ]
                  }>
                  </DataTable>
                  <br />
                  <DataTable id="service.mounts.list" headers={
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
                <Section id="service.ports" heading="Ports" >
                  <DataTable id="service.ports.list" headers={
                    [
                      'Type'
                      , 'Target'
                      , 'Published'
                      , 'Mode'
                    ]
                  } rows={ports}
                  >
                  </DataTable>
                </Section>

                <Section id="service.labels" heading="Labels" >
                  <DataTable id="service.labels.table" headers={
                    [
                      'Label'
                      , 'Value'
                      , 'Source'
                    ]
                  } rows={labels}
                  >
                  </DataTable>
                </Section>

                <Section id="service.networks" heading="Networks" xs={12} >
                  <DataTable id="service.networks.table" headers={
                    [
                      'ID'
                      , 'Name'
                      , 'Aliases'
                      , 'Options'
                      , 'Address'
                    ]
                  } rows={networksData}
                  >
                  </DataTable>
                </Section>

                <Section id="service.reach" heading="Reach" xs={12} >
                  <VisNetwork
                    data={reachGraph}
                    options={reachOptions}
                    events={reachEvents}
                  />
                </Section>

                {
                  svcConfigs &&
                  <Section id="service.configs" heading="Configs" xs={12}>
                    <DataTable
                      id="service.configs.table"
                      headers={['CONFIG', 'MOUNTPOINT', 'UID:GID']}
                      rows={svcConfigs}
                    />
                  </Section>
                }

                {
                  svcSecrets &&
                  <Section id="service.secrets" heading="Secrets" xs={12}>
                    <DataTable
                      id="service.secrets.table"
                      headers={['SECRET', 'MOUNTPOINT', 'UID:GID']}
                      rows={svcSecrets}
                    />
                  </Section>
                }

                {
                  svcTasks &&
                  <Section id="service.tasks" heading="Tasks" xs={12}>
                    <DataTable id="service.tasks.table" headers={svcTaskHeaders} rows={svcTasks}>
                    </DataTable>
                  </Section>
                }

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <LogsView
            logsUrl={props.baseUrl + 'services/' + id + '/logs'}
            id='tasks.logs' 
            />
        }
        {
          tab === 2 &&
          <Box>
            <JSONPretty data={service} />
          </Box>
        }
      </Box >
    )
  }

}

export default ServiceUi;