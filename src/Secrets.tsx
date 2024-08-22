import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Secret, Service } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DockerApi } from './DockerApi';

interface SecretsProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Secrets(props: SecretsProps) {

  const [secrets, setSecrets] = useState<Secret[]>([])
  const [services, setServices] = useState<Map<string, Service[]>>(new Map())
  const [data, setData] = useState<(string | DataTablePropsEntry | DataTablePropsEntry[])[][]>()

  useEffect(() => {
    props.docker.secrets()
      .then(secs => {
        props.setTitle('Secrets')
        if (secs) {
          setSecrets(secs)
        }
      })
    props.docker.services()
      .then(j => {
        const buildServices: Map<string, Service[]> = new Map()
        j.forEach((svc: Service) => {
          svc.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(svcSec => {
            if (svcSec.SecretID) {
              let svcSecrets = buildServices.get(svcSec.SecretID)
              if (!svcSecrets) {
                svcSecrets = []
                buildServices.set(svcSec.SecretID, svcSecrets)
              }
              svcSecrets.push(svc)
            }
          })
        });
        setServices(buildServices)
      })
  }, [props])

  useEffect(() => {
    const newData = [] as (string | DataTablePropsEntry | DataTablePropsEntry[])[][]
    secrets.forEach((sec: Secret) => {
      if (sec.ID) {
        const secSvcs = services?.get(sec.ID)?.map(svc => {
          return { link: '/service/' + svc.ID, value: svc.Spec?.Name || svc.ID || '' }
        })

        newData.push(
          [
            { link: '/secret/' + sec.ID, value: sec.ID }
            , sec.Spec?.Name || ''
            , sec.CreatedAt || ''
            , secSvcs || ''
          ]
        )
      }
    });
    setData(newData)
  }, [secrets, services])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="secrets" headers={
            ['ID', 'NAME', 'CREATED', 'SERVICES']
          } rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Secrets;