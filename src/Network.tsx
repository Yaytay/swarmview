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
import DataTable, { DataTablePropsEntry } from './DataTable';


interface NetworkProps {
  baseUrl: string
  setTitle: (title: string) => void
}
type NetworkUiParams = {
  id: string;
};
function NetworkUi(props: NetworkProps) {

  const [network, setNetwork] = useState<Network | null>(null)
  const [tab, setTab] = useState(0)

  const { id } = useParams<NetworkUiParams>();
  console.log(id)

  const [networks, setNetworks] = useState<Network[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])
  const [mounts, setMounts] = useState<(string | undefined)[][]>([])
  const [resources, setResources] = useState<(string | number | null)[][]>([])
  const [networksData, setNetworksData] = useState<(string | string[] | undefined | DataTablePropsEntry[])[][]>([])

  useEffect(() => {
    fetch(props.baseUrl + 'networks')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get networks:', reason)
      })
      .then(j => {
        console.log('Networks: ', j)
        const nets = j as Network[]
        setNetworks(nets)
        const net = nets.find(net => { return net.Id === id })
        if (net) {
          setNetwork(net)
        } 
      })

    fetch(props.baseUrl + 'services?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get services:', reason)
      })
      .then(j => {
        setServices(j)
      })
  }
    , [props.baseUrl, id])

  useEffect(() => {
    props.setTitle('Network: ' + network?.Name)

    var buildLabels = [] as (string | number | DataTablePropsEntry)[][]
    if (network?.Labels) {
      const record = network.Labels
      Object.keys(record).forEach(key => {
        if (record[key]) {
          buildLabels.push([key, record[key]])
        }
      })
    }
    setLabels(buildLabels)

  }, [network, services])

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
                  , 'Options'
                  , 'Networks'
                ]
              } rows={networksData}
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