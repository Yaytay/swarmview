import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Network } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DockerApi } from './DockerApi';
import KeyValueTable from './KeyValueTable';
import LabelsTable, { createLabelDetails, LabelDetails } from './tables/LabelsTable';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';
import IpamConfigsTable, { createIpamConfigDetails, IpamConfigDetails } from './tables/IpamConfigsTable';


interface NetworkProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
type NetworkUiParams = {
  id: string;
};
function NetworkUi(props: NetworkProps) {

  const [network, setNetwork] = useState<Network | undefined>()
  const [tab, setTab] = useState(0)

  const { id } = useParams<NetworkUiParams>();

  const [labelDetails, setLabelDetails] = useState<LabelDetails[]>([])
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])
  const [ipamDetails, setIpamDetails] = useState<IpamConfigDetails[]>([])

  useEffect(() => {
    Promise.all([
      props.docker.networks()
      , props.docker.services()
      , props.docker.exposedPorts()
    ]).then(value => {
      const nets = value[0]
      const services = value[1]
      const exposedPorts = value[2]

      const net = nets.find(net => { return net.Id === id })
      setNetwork(net)
      props.setTitle('Network: ' + net?.Name)

      if (net && services) {
        setServiceDetails(services.reduce((result, current) => {

          current.Spec?.TaskTemplate?.Networks?.forEach(svcNet => {
            if (svcNet?.Target == id && current.ID) {
              result.push(createServiceDetails(current, exposedPorts))
            }
          })

          return result
        }, [] as ServiceDetails[])
        )
      }

      if (net?.Labels) {
        const record = net.Labels
        setLabelDetails(Object.keys(record).reduce((result, current) => {
          result.push(createLabelDetails(current, record[current]))
          return result
        }, [] as LabelDetails[]))
      } else {
        setLabelDetails([])
      }
      if (net?.IPAM?.Config) {
        setIpamDetails(net.IPAM.Config.reduce((result, current) => {
          result.push(createIpamConfigDetails(current))
          return result
        }, [] as IpamConfigDetails[]))
      } else {
        setIpamDetails([])
      }
    })
  }
    , [props, id])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!network) {
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
                <Section id="network.overview" heading="Overview" >
                  <KeyValueTable id="network.overview.table" kvTable={true} rows={
                    [
                      ['ID', network.Id || '']
                      , ['Created', network.Created || '']
                      , ['Scope', network?.Scope || ' ']
                      , ['Driver', network?.Driver || ' ']
                      , ['IPv6', String(network?.EnableIPv6)]
                      , ['Internal', String(network?.Internal)]
                      , ['Attachable', String(network?.Attachable)]
                      , ['Ingress', String(network?.Ingress)]
                      , ['Stack', network?.Labels && network?.Labels['com.docker.stack.namespace'] ? { link: '/stack/' + network?.Labels['com.docker.stack.namespace'], value: network?.Labels['com.docker.stack.namespace'] } : '']
                    ]
                  }>
                  </KeyValueTable>
                </Section>
                <Section id="network.ipam" heading="IPAM" xs={6} >
                  <KeyValueTable id="network.ipam.table" kvTable={true} sx={{ width: '20em' }} rows={
                    [
                      ['Driver', network?.IPAM?.Driver]
                      , ['Options', JSON.stringify(network?.IPAM?.Options)]
                    ]
                  }>
                  </KeyValueTable>
                  <h3>IPAM Config</h3>
                  <IpamConfigsTable id="network.ipamconfig.table" ipams={ipamDetails} />
                </Section>
                <Section id="network.labels" heading="Labels" >
                  <LabelsTable id="network.labels.table" labels={labelDetails} />
                </Section>

                <Section id="network.services" heading="Services" xs={12} >
                  <ServicesTable id="network.services.table" services={serviceDetails} />
                </Section>
              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <Box>
            <JSONPretty data={network} />
          </Box>
        }
      </Box >
    )
  }

}

export default NetworkUi;