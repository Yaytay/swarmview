import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface StacksProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Stacks(props: StacksProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS'])

  useEffect(() => {
    fetch(props.baseUrl + 'stacks?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get stacks:', reason)
      })
      .then(j => {
        props.setTitle('Stacks')
        var newData = [] as (string | DataTablePropsEntry)[][]
        setData(newData)
      })
  }
    , [props.baseUrl])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="stacks" headers={headers} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Stacks;