import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Config, Service } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface ConfigsProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Configs(props: ConfigsProps) {

  const [configs, setConfigs] = useState<Config[]>([])
  const [services, setServices] = useState<Map<string, Service[]>>(new Map())
  const [data, setData] = useState<(string | DataTablePropsEntry | DataTablePropsEntry[])[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'CREATED', 'SERVICES'])

  useEffect(() => {
    fetch(props.baseUrl + 'configs')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get configs:', reason)
      })
      .then(j => {
        props.setTitle('Configs')
        setConfigs(j)
      })
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
        const buildServices: Map<string, Service[]> = new Map()
        j.forEach((svc: Service) => {
          svc.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(svcCnf => {
            if (svcCnf.ConfigID) {
              var svcConfigs = buildServices.get(svcCnf.ConfigID)
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
  }, [props.baseUrl])

  useEffect(() => {
    var newData = [] as (string | DataTablePropsEntry | DataTablePropsEntry[])[][]
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
        <DataTable id="configs" headers={headers} rows={data}>
        </DataTable>
      </Paper>
    </Grid>
  </Box>
</>)


}

export default Configs;