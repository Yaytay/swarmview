import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Secret } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface SecretsProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Secrets(props: SecretsProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS'])

  useEffect(() => {
    fetch(props.baseUrl + 'secrets?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get secrets:', reason)
      })
      .then(j => {
        props.setTitle('Secrets')
        var newData = [] as (string | DataTablePropsEntry)[][]
        j.forEach((svc: Secret) => {
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
          <DataTable id="secrets" headers={headers} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Secrets;