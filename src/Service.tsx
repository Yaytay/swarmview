import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Service, Network } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';


interface ServiceProps {
  baseUrl: string
  setTitle: (title: string) => void
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
  const [networksData, setNetworksData] = useState<(DataTableValue)[][]>([])

  useEffect(() => {
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
        console.log('Networks: ', j)
        setNetworks(j as Network[])
      })
    fetch(props.baseUrl + 'services?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get service:', reason)
      })
      .then(j => {
        setServices(j)
        const buildService = (j as Service[]).find(svc => { return svc.ID === id })
        console.log(buildService)
        if (!buildService) {
          console.log('Service ' + id + ' not found in ', j)
        } else {
          setService(buildService)
          props.setTitle('Service: ' + buildService.Spec?.Name)
          var buildLabels = [] as (string | number | DataTablePropsEntry)[][]
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

          var buildMounts = [] as (string | undefined)[][]
          if (buildService?.Spec?.TaskTemplate?.ContainerSpec?.Mounts) {
            buildMounts = buildService.Spec.TaskTemplate.ContainerSpec.Mounts.map(mount => {
              return [
                mount.Type
                , mount.Target
                , mount.Source
                , String(mount.ReadOnly)
              ]
            })
            setMounts(buildMounts)
          }
        }
      })
  }
    , [props.baseUrl, id])

  useEffect(() => {
    var buildNetworks = [] as (DataTableValue)[][]
    if (service?.Spec?.TaskTemplate?.Networks) {

      buildNetworks = service.Spec.TaskTemplate.Networks.reduce<(DataTableValue)[][]>((accumulator, svcNet) => {
        var net = networks?.find(n => n.Id === svcNet.Target)
        if (net && svcNet.Target) {
          const item = [
            { link: '/network/' + svcNet.Target, value: svcNet.Target }
            , net?.Name
            , svcNet.Aliases
            , JSON.stringify(net?.Options)
            , services?.reduce<DataTablePropsEntry[]>((result, svc) => {
              if (svc?.Spec?.TaskTemplate?.Networks?.find(n => { return n.Target === net?.Id })) {
                if (svc?.Spec?.Name && (!result.find(s => {return (s.value === svc?.Spec?.Name)}))) {
                  result.push({ link: '/service/' + svc.ID, value: svc?.Spec?.Name })
                }
              }
              return result
            }, []).sort()
          ]
          accumulator.push(item)
        }
        return accumulator
      }, [])
    }
    console.log(buildNetworks)
    setNetworksData(buildNetworks)

    var buildResources = [] as (string | number | null)[][]
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

  }, [service, networks])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!service) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%'}} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Details" />
            <Tab label="Raw" />
          </Tabs>
        </Box>
        {
      tab === 0 &&
      <Box>
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
              <br/>
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
                  , 'Services'
                ]
              } rows={networksData}
              >
              </DataTable>
            </Section>
          </Grid>
        </Box>
      </Box>
    }
    {
      tab === 1 &&
      <Box>
        <JSONPretty data={service} />
      </Box>
    }
      </Box >
    )
  }

}

export default ServiceUi;