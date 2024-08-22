import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Config, Service } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DockerApi } from './DockerApi';

interface ConfigsProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Configs(props: ConfigsProps) {

  const [configs, setConfigs] = useState<Config[]>([])
  const [services, setServices] = useState<Map<string, Service[]>>(new Map())
  const [data, setData] = useState<(string | DataTablePropsEntry | DataTablePropsEntry[])[][]>()

  useEffect(() => {

    props.docker.configs()
      .then(cfgs => {
        props.setTitle('Configs')
        if (cfgs) {
          setConfigs(cfgs)
        }
      })
    props.docker.services()
      .then(svcs => {
        const buildServices: Map<string, Service[]> = new Map()
        svcs.forEach((svc: Service) => {
          svc.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(svcCnf => {
            if (svcCnf.ConfigID) {
              let svcConfigs = buildServices.get(svcCnf.ConfigID)
              if (!svcConfigs) {
                svcConfigs = []
                buildServices.set(svcCnf.ConfigID, svcConfigs)
              }
              svcConfigs.push(svc)
            }
          })
        });
        setServices(buildServices)
      })
  }, [props.refresh])

  useEffect(() => {
    const newData = [] as (string | DataTablePropsEntry | DataTablePropsEntry[])[][]
    configs.forEach((cnf: Config) => {
      if (cnf.ID) {
        const cnfSvcs = services?.get(cnf.ID)?.map(svc => {
          return { link: '/service/' + svc.ID, value: svc.Spec?.Name || svc.ID || '' }
        })

        newData.push(
          [
            { link: '/config/' + cnf.ID, value: cnf.ID }
            , cnf.Spec?.Name || ''
            , cnf.CreatedAt || ''
            , cnfSvcs || ''
          ]
        )
      }
    });
    setData(newData)
  }, [configs, services])

return (<>
  <Box sx={{ flexGrow: 1 }}>
    <Grid container >
      <Paper>
        <DataTable id="configs" headers={
          ['ID', 'NAME', 'CREATED', 'SERVICES']
        } rows={data}>
        </DataTable>
      </Paper>
    </Grid>
  </Box>
</>)


}

export default Configs;