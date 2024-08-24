import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Service } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DockerApi } from './DockerApi';

interface ServicesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Services(props: ServicesProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()
  const [services, setServices] = useState<Service[]>()
  const [exposedPorts, setExposedPorts] = useState<Record<string, string[]>>()

  useEffect(() => {
    props.docker.exposedPorts()
      .then(ports => {
        setExposedPorts(ports)
      })
    props.docker.services()
      .then(svcs => {
        props.setTitle('Services')
        setServices(svcs)
      })
  }, [props])

  useEffect(() => {
    const newData = [] as (string | DataTablePropsEntry)[][]
    services?.forEach((svc: Service) => {
      newData.push(
        [
          svc.ID ? { link: '/service/' + svc.ID, value: svc.ID } : ''
          , svc.Spec?.Name || ''
          , Object.keys(svc.Spec?.Mode || [''])[0]
          , svc.ServiceStatus?.RunningTasks + ' / ' + svc.ServiceStatus?.DesiredTasks
          , svc.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || ''
          ,
          (
            svc.Endpoint?.Ports?.map((p) => {
              return p.PublishedPort + ':' + p.TargetPort
            }).join(', ') || ''
          )
          + (svc.Endpoint?.Ports ? ', ' : '')
          + (
            exposedPorts
            && svc.Spec?.TaskTemplate?.ContainerSpec?.Image
            && exposedPorts[svc.Spec.TaskTemplate.ContainerSpec.Image.replace(/:.*@/, '@')]?.join(', ') || ''
          )
        ]
      )
    });
    setData(newData)
  }, [exposedPorts, services])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="services" headers={
            ['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS']
          } rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Services;