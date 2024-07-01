import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Node } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface NodesProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Nodes(props: NodesProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS'])

  useEffect(() => {
    fetch(props.baseUrl + 'nodes?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get nodes:', reason)
      })
      .then(j => {
        props.setTitle('Nodes')
        var newData = [] as (string | DataTablePropsEntry)[][]
        j.forEach((svc: Node) => {
          newData.push(
            [
            ]
          )
        });
        setData(newData)
      })
  }
    , [props.baseUrl])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="nodes" headers={headers} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Nodes;