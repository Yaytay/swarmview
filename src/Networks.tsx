import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Network } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface NetworksProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Networks(props: NetworksProps) {

  const [data, setData] = useState<(string | undefined | DataTablePropsEntry)[][]>()

  useEffect(() => {
    fetch(props.baseUrl + 'networks?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get networks:', reason)
      })
      .then(j => {
        props.setTitle('Networks')
        const newData = [] as (string | undefined | DataTablePropsEntry)[][]
        j.forEach((net: Network) => {
          newData.push(
            [
              net.Id ? { link: '/network/' + net.Id, value: net.Id } : ''
              , net.Name
              , net.Driver
              , net.Scope
              , net?.Options?.encrypted
            ]
          )
        });
        setData(newData)
      })
  }
    , [props])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="networks" headers={
            ['ID', 'NAME', 'DRIVER', 'SCOPE', 'ENCRYPTED']
          } rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Networks;