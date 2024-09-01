import { useState, useEffect, useMemo } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Network, Service } from './docker-schema';
import { DockerApi } from './DockerApi';
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';

interface Stack {
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

  const [stacks, setStacks] = useState<(string | number | DataTablePropsEntry)[][]>()
  const [tstacks, setTStacks] = useState<Stack[]>([])
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
    const buildStacks = [] as (string | number | DataTablePropsEntry)[][]
    const buildTStacks = [] as Stack[]
    services.forEach((svcs, key) => {
      buildStacks.push([
        { link: '/stack/' + key, value: key }
        , svcs.length
        , networks?.get(key)?.length || 0
      ])
      buildTStacks.push({
        name: key
        , services: svcs?.length || 0
        , networks: networks?.get(key)?.length || 0
      })
    })
    setStacks(buildStacks)
    setTStacks(buildTStacks)
  }, [services, networks])

  const columns = useMemo<MRT_ColumnDef<Stack>[]>(
    () => [
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
    ], [])

  const globalTheme = useTheme();

  const table = useMaterialReactTable(
    {
      columns: columns
      , data: tstacks
      , enablePagination: false
      , enableFacetedValues: true
      , layoutMode: 'semantic'
      , initialState: {
        density: 'compact'
      }
      , mrtTheme: {
        baseBackgroundColor: globalTheme.palette.mode === 'light' ? '#F8F8F8' : '#000'
      }
      , getRowId: (originalRow) => originalRow.name
      ,
    }
  );
  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="stacks" headers={['NAME', 'SERVICES', 'NETWORKS']} rows={stacks}>
          </DataTable>
        </Paper>
      </Grid>
      <br />
      <Grid container >
        <MaterialReactTable table={table} />
      </Grid>
    </Box>
  </>)


}

export default Stacks;