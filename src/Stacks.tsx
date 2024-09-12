import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Network, Service } from './docker-schema';
import { DockerApi } from './DockerApi';
import { MRT_ColumnDef } from 'material-react-table';
import { Link } from 'react-router-dom';
import MaterialTable from './MaterialTable';

interface StackData {
  name: string
  services: number
  networks: number
}

interface StacksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Stacks(props: StacksProps) {

  const [tstacks, setTStacks] = useState<StackData[]>([])
  const [services, setServices] = useState<Map<string, Service[]>>(new Map())
  const [networks, setNetworks] = useState<Map<string, Network[]>>(new Map())

  useEffect(() => {
    props.docker.services()
      .then(j => {
        props.setTitle('Stacks')
        const baseServices = j as Service[]
        const buildServices = new Map<string, Service[]>()
        baseServices.forEach(svc => {
          const labels = svc.Spec?.Labels
          if (labels) {
            const namespace = labels['com.docker.stack.namespace']
            if (namespace) {
              const current = buildServices.get(namespace)
              if (current) {
                current.push(svc)
              } else {
                buildServices.set(namespace, [svc])
              }
            }
          }
        })
        setServices(buildServices)
      })
    props.docker.networks()
      .then(j => {
        const baseNetworks = j as Network[]
        const buildNetworks = new Map<string, Network[]>()
        baseNetworks.forEach(net => {
          const labels = net.Labels
          if (labels) {
            const namespace = labels['com.docker.stack.namespace']
            if (namespace) {
              const current = buildNetworks.get(namespace)
              if (current) {
                current.push(net)
              } else {
                buildNetworks.set(namespace, [net])
              }
            }
          }
        })
        setNetworks(buildNetworks)
      })
  }
    , [props])

  useEffect(() => {
    const buildTStacks = [] as StackData[]
    services.forEach((svcs, key) => {
      buildTStacks.push({
        name: key
        , services: svcs?.length || 0
        , networks: networks?.get(key)?.length || 0
      })
    })
    setTStacks(buildTStacks)
  }, [services, networks])

  const columns : MRT_ColumnDef<StackData>[] = [
      {
        accessorKey: 'name',
        header: 'NAME',
        size: 1,
        Cell: ({ renderedCellValue, row }) =>
          (<Link to={"/stack/" + row.original.name} >{renderedCellValue}</Link>)
      },
      {
        accessorKey: 'services',
        header: 'SERVICES',
        size: 1,
      },
      {
        accessorKey: 'networks',
        header: 'NETWORKS',
        size: 1,
      },
  ]

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <MaterialTable id="stacks" columns={columns} data={tstacks} />
      </Grid>
    </Box>
  </>)


}

export default Stacks;