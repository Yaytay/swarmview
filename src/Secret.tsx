import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Secret } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DockerApi } from './DockerApi';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';
import KeyValueTable from './KeyValueTable';
import { SetTitle } from './App';


interface SecretProps {
  baseUrl: string
  setTitle: SetTitle
  docker: DockerApi
  refresh: Date
}
type SecretUiParams = {
  id: string;
};
function SecretUi(props: SecretProps) {

  const { id } = useParams<SecretUiParams>();

  const [secret, setSecret] = useState<Secret | undefined>()
  const [tab, setTab] = useState(0)

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])

  useEffect(() => {
    Promise.all([
      props.docker.secret(id)
      , props.docker.services()
      , props.docker.exposedPorts()
    ]).then(value => {
      const conf = value[0]
      const services = value[1]
      const exposedPorts = value[2]

      props.setTitle('Secret: ' + (secret?.Spec?.Name || secret?.ID || id))
      setSecret(conf)

      if (conf && services) {
        setServiceDetails(services.reduce((result, current) => {

          current.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(con => {
            if (con.SecretID === id) {
              result.push(createServiceDetails(current, exposedPorts))
            }
          })
  
          return result
        }, [] as ServiceDetails[])
        )
      }
    })

  }, [props, id, secret?.ID, secret?.Spec?.Name])

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
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
                  <KeyValueTable id="secret.overview.table" kvTable={true} rows={
                    [
                      ['ID', secret.ID || '']
                      , ['Created', secret.CreatedAt]
                      , ['Updated', secret.UpdatedAt]
                    ]
                  }>
                  </KeyValueTable>
                </Section>
                {
                  serviceDetails &&
                  <Section id="secret.services" heading="Services" xs={12}>
                    <ServicesTable id="secret.services.table" services={serviceDetails} />
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