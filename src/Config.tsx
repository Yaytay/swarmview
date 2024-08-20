import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Config, Service } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTableValue } from './DataTable';
import { DockerApi } from './DockerApi';


interface ConfigProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
type ConfigUiParams = {
  id: string;
};
function ConfigUi(props: ConfigProps) {

  const { id } = useParams<ConfigUiParams>();

  const [config, setConfig] = useState<Config | null>(null)
  const [tab, setTab] = useState(0)

  const [services, setServices] = useState<Service[]>([])
  const [configServices, setConfigServices] = useState<DataTableValue[][]>([])

  useEffect(() => {

    props.docker.config(id)
      .then(conf => {
        if (conf) {
          setConfig(conf)
        }
      })

    props.docker.services()
      .then(svcs => {
        const buildServices = svcs.filter(svc => {
          return svc.Spec?.TaskTemplate?.ContainerSpec?.Configs?.find(con => con.ConfigID === id)
        })
        setServices(buildServices)
      })

  }, [props.refresh, id])

  useEffect(() => {
    props.setTitle('Config: ' + (config?.Spec?.Name || config?.ID))

    if (config && services) {
      const conSvcs: DataTableValue[][] = []
      services.forEach(svc => {
        svc.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(con => {
          if (con.ConfigID === id) {
            conSvcs.push(
              [
                { link: '/service/' + svc.ID, value: svc.Spec?.Name || svc.ID || '' }
                , con.ConfigName
                , con.File?.Name
                , con.File?.UID + ':' + con.File?.GID
              ]
            )
          }
        })
      })
      setConfigServices(conSvcs)
    }

  }, [config, services, props, id])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
                  <DataTable id="config.overview.table" kvTable={true} rows={
                    [
                      ['ID', config.ID || '']
                      , ['Created', config.CreatedAt]
                      , ['Updated', config.UpdatedAt]
                    ]
                  }>
                  </DataTable>
                </Section>
                {
                  services &&
                  <Section id="config.services" heading="Services" xs={12}>
                    <DataTable
                      id="config.services.table"
                      headers={['SERVICE', 'CONFIG NAME', 'MOUNTPOINT', 'UID:GID']}
                      rows={configServices}
                    />
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