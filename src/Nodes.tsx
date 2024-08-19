import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Node } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DockerApi } from './DockerApi';

interface NodesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
}
function Nodes(props: NodesProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()

  useEffect(() => {
    props.docker.nodes()
      .then(j => {
        props.setTitle('Nodes')
        const newData = [] as (string | DataTablePropsEntry)[][]
        j.forEach((nod: Node) => {
          if (nod.ID) {
            newData.push(
              [
                { link: '/node/' + nod.ID, value: nod.ID }
                , nod.Description?.Hostname || ''
                , nod.Status?.State || ''
                , nod.Spec?.Availability || ''
                , nod.ManagerStatus?.Leader ? 'leader' : nod.ManagerStatus?.Reachability || ''
                , nod.Description?.Engine?.EngineVersion || ''
              ]
            )
          }
        });
        setData(newData)
      })
  }
    , [props])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="nodes" headers={
            ['ID', 'HOSTNAME', 'STATUS', 'AVAILABILITY', 'MANAGER STATUS', 'ENGINE VERSION']
          } rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Nodes;