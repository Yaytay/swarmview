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
  exposedPorts: Record<string, string[]>
}
function Services(props: ServicesProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()

  useEffect(() => {
    props.docker.services()
      .then(j => {
        props.setTitle('Services')
        const newData = [] as (string | DataTablePropsEntry)[][]
        j.forEach((svc: Service) => {
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
                props.exposedPorts
                && svc.Spec?.TaskTemplate?.ContainerSpec?.Image
                && props.exposedPorts[svc.Spec.TaskTemplate.ContainerSpec.Image.replace(/:.*@/, '@')]?.join(', ') || ''
              )
            ]
          )
        });
        setData(newData)
      })
  }
    , [props])

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