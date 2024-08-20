import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Network, Service } from './docker-schema';
import { DockerApi } from './DockerApi';

interface StacksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Stacks(props: StacksProps) {

  const [stacks, setStacks] = useState<(string | number | DataTablePropsEntry)[][]>()
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
    services.forEach((svcs, key) => {
      buildStacks.push([
        { link: '/stack/' + key, value: key }
        , svcs.length
        , networks?.get(key)?.length || 0
      ])
    })
    setStacks(buildStacks)
  }, [services, networks])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="stacks" headers={['NAME', 'SERVICES', 'NETWORKS']} rows={stacks}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Stacks;