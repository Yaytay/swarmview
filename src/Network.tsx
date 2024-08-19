import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Network, Service } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';
import { DockerApi } from './DockerApi';


interface NetworkProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
}
type NetworkUiParams = {
  id: string;
};
function NetworkUi(props: NetworkProps) {

  const [network, setNetwork] = useState<Network | null>(null)
  const [tab, setTab] = useState(0)

  const { id } = useParams<NetworkUiParams>();

  const [services, setServices] = useState<Service[]>([])
  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])
  const [networkServices, setNetworkServices] = useState<DataTableValue[][]>([])

  useEffect(() => {
    props.docker.networks()
      .then(nets => {
        console.log('Networks: ', nets)
        const net = nets.find(net => { return net.Id === id })
        if (net) {
          setNetwork(net)
        } 
      })

    props.docker.services()
      .then(j => {
        setServices(j)
      })
  }
    , [props.baseUrl, id])

  useEffect(() => {
    props.setTitle('Network: ' + network?.Name)

    const buildLabels = [] as (string | number | DataTablePropsEntry)[][]
    if (network?.Labels) {
      const record = network.Labels
      Object.keys(record).forEach(key => {
        if (record[key]) {
          buildLabels.push([key, record[key]])
        }
      })
    }
    setLabels(buildLabels)

    const buildNetworkServices: DataTableValue[][] = []
    services.forEach(svc => {
      svc.Spec?.TaskTemplate?.Networks?.forEach(svcNet => {
        console.log(svcNet)
        if (svcNet?.Target == id && svc.ID) {
          buildNetworkServices.push(
            [
              { link: '/service/' + svc.ID, value: svc.ID }
              , svc.Spec?.Name
              , svcNet.Aliases
              , JSON.stringify(svcNet.DriverOpts)
            ]
          )
        }
      })
    })
    setNetworkServices(buildNetworkServices)

  }, [network, services, props, id])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!network) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%'}} >
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
              <DataTable id="network.overview.table" kvTable={true} rows={
                [
                  ['ID', network.Id || '']
                  , ['Created', network.Created || '']
                  , ['Scope', network?.Scope || ' ']
                  , ['Driver', network?.Driver || ' ']
                  , ['IPv6', String(network?.EnableIPv6)]
                  , ['Internal', String(network?.Internal)]
                  , ['Attachable', String(network?.Attachable)]
                  , ['Ingress', String(network?.Ingress)]
                  , ['Stack', network?.Labels && network?.Labels['com.docker.stack.namespace'] ? { link: '/stack/' + network?.Labels['com.docker.stack.namespace'], value: network?.Labels['com.docker.stack.namespace'] } : '' ]
                ]
              }>
              </DataTable>
            </Section>
            <Section id="network.ipam" heading="IPAM" xs={6} >
            <DataTable id="network.ipam.table" kvTable={true} sx={{ width: '20em' }} rows={
                [
                  ['Driver', network?.IPAM?.Driver]
                  , ['Options', JSON.stringify(network?.IPAM?.Options)]
                ]
              }>
              </DataTable>
              <h3>IPAM Config</h3>
              <DataTable id="network.ipamconfig.table" 
                headers={['Subnet', 'IP Range', 'Gateway', 'Auxiliary Addresses']}
                rows={
                  network?.IPAM?.Config?.map(c => {
                    return [
                      c.Subnet
                      , c.IPRange
                      , c.Gateway
                      , JSON.stringify(c.AuxiliaryAddresses)
                    ]
                  })
                }>
              </DataTable>
            </Section>
            <Section id="network.labels" heading="Labels" >
              <DataTable id="network.labels.table" headers={
                [
                  'Label'
                  , 'Value'
                ]
              } rows={labels}
              >
              </DataTable>
            </Section>

            <Section id="network.services" heading="Services" xs={12} >
              <DataTable id="network.services.table" headers={
                [
                  'ID'
                  , 'Name'
                  , 'Aliases'
                ]
              } rows={networkServices}
              >
              </DataTable>
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