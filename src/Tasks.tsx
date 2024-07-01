import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Task } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Tasks(props: TasksProps) {

  const [data, setData] = useState<(string | DataTablePropsEntry)[][]>()
  const [headers, _] = useState(['ID', 'NAME', 'MODE', 'REPLICAS', 'IMAGE', 'PORTS'])

  useEffect(() => {
    fetch(props.baseUrl + 'tasks?status=true')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get tasks:', reason)
      })
      .then(j => {
        props.setTitle('Tasks')
        var newData = [] as (string | DataTablePropsEntry)[][]
        j.forEach((svc: Task) => {
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
          <DataTable id="tasks" headers={headers} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Tasks;