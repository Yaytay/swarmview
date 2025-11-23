import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Config } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DockerApi } from './DockerApi';
import KeyValueTable from './KeyValueTable';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';
import { SetTitle } from './App';


interface ConfigProps {
  baseUrl: string
  setTitle: SetTitle
  docker: DockerApi
  refresh: Date
}
type ConfigUiParams = {
  id: string;
};
function ConfigUi(props: ConfigProps) {

  const { id } = useParams<ConfigUiParams>();

  const [config, setConfig] = useState<Config | undefined>()
  const [tab, setTab] = useState(0)

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])

  useEffect(() => {
    Promise.all([
      props.docker.config(id)
      , props.docker.services()
      , props.docker.exposedPorts()
    ]).then(value => {
      const conf = value[0]
      const services = value[1]
      const exposedPorts = value[2]

      props.setTitle('Config: ' + (config?.Spec?.Name || config?.ID || id))
      setConfig(conf)

      if (conf && services) {
        setServiceDetails(services.reduce((result, current) => {

          current.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(con => {
            if (con.ConfigID === id) {
              result.push(createServiceDetails(current, exposedPorts))
            }
          })
  
          return result
        }, [] as ServiceDetails[])
        )
      }
    })

  }, [props, id, config?.ID, config?.Spec?.Name])

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!config) {
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
                <Section id="config.overview" heading="Overview" >
                  <KeyValueTable id="config.overview.table" kvTable={true} rows={
                    [
                      ['ID', config.ID || '']
                      , ['Created', config.CreatedAt]
                      , ['Updated', config.UpdatedAt]
                    ]
                  }>
                  </KeyValueTable>
                </Section>
                {
                  serviceDetails &&
                  <Section id="config.services" heading="Services" xs={12}>
                    <ServicesTable id="config.services.table" services={serviceDetails} />
                  </Section>
                }
                <Section id="config.value" heading="Value" xs={12}>
                  <pre>
                    {config.Spec?.Data && atob(config.Spec?.Data)}
                  </pre>
                </Section>

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <Box>
            <JSONPretty data={config} />
          </Box>
        }
      </Box >
    )
  }

}

export default ConfigUi;