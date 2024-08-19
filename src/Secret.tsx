import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Secret, Service } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTableValue } from './DataTable';
import { DockerApi } from './DockerApi';


interface SecretProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
}
type SecretUiParams = {
  id: string;
};
function SecretUi(props: SecretProps) {

  const { id } = useParams<SecretUiParams>();

  const [secret, setSecret] = useState<Secret | null>(null)
  const [tab, setTab] = useState(0)

  const [services, setServices] = useState<Service[]>([])
  const [secretServices, setSecretServices] = useState<DataTableValue[][]>([])

  useEffect(() => {
    props.docker.secret(id)
      .then(sec => {
        if (sec) {
          setSecret(sec)
        }
      })
    props.docker.services()
      .then(j => {
        const svcs = j as Service[]
        const buildServices = svcs.filter(svc => {
          return svc.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.find(sec => sec.SecretID === id)
        })
        setServices(buildServices)
      })
  }, [props.baseUrl, id])

  useEffect(() => {
    props.setTitle('Secret: ' + (secret?.Spec?.Name || secret?.ID))

    if (secret && services) {
      const secSvcs: DataTableValue[][] = []
      services.forEach(svc => {
        svc.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(sec => {
          if (sec.SecretID === id) {
            secSvcs.push(
              [
                { link: '/service/' + svc.ID, value: svc.Spec?.Name || svc.ID || '' }
                , sec.SecretName
                , sec.File?.Name
                , sec.File?.UID + ':' + sec.File?.GID
              ]
            )
          }
        })
      })
      setSecretServices(secSvcs)
    }

  }, [secret, services, id, props])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!secret) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%' }} >
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
                <Section id="secret.overview" heading="Overview" >
                  <DataTable id="secret.overview.table" kvTable={true} rows={
                    [
                      ['ID', secret.ID || '']
                      , ['Created', secret.CreatedAt]
                      , ['Updated', secret.UpdatedAt]
                    ]
                  }>
                  </DataTable>
                </Section>
                {
                  services &&
                  <Section id="secret.services" heading="Services" xs={12}>
                    <DataTable
                      id="secret.services.table"
                      headers={['SERVICE', 'SECRET NAME', 'MOUNTPOINT', 'UID:GID']}
                      rows={secretServices}
                    />
                  </Section>
                }

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <Box>
            <JSONPretty data={secret} />
          </Box>
        }
      </Box >
    )
  }

}

export default SecretUi;