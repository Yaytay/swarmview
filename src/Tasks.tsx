import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Service, Task, Node } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
}
function Tasks(props: TasksProps) {

  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map<string, Service>())
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map<string, Node>())

  const [data, setData] = useState<(string | string[] | DataTablePropsEntry)[][]>()

  useEffect(() => {
    fetch(props.baseUrl + 'tasks')
    .then(r => {
      if (r.ok) {
        return r.json();
      }
    })
    .catch(reason => {
      console.log('Failed to get tasks:', reason)
    })
    .then(j => {
      setTasks(j)
    })

    fetch(props.baseUrl + 'services')
    .then(r => {
      if (r.ok) {
        return r.json();
      }
    })
    .catch(reason => {
      console.log('Failed to get services:', reason)
    })
    .then(j => {
      const buildServices = new Map<string, Service>()
      for (const svc in j) {
        buildServices.set(j[svc].ID, j[svc])
      }
      setServices(buildServices)
    })

    fetch(props.baseUrl + 'nodes')
    .then(r => {
      if (r.ok) {
        return r.json();
      }
    })
    .catch(reason => {
      console.log('Failed to get nodes:', reason)
    })
    .then(j => {
      const buildNodes = new Map<string, Node>()
      for (const nod in j) {
        buildNodes.set(j[nod].ID, j[nod])
      }
      setNodes(buildNodes)
    })
  }, [props.baseUrl])

  useEffect(() => {
    if (tasks && services) {
      props.setTitle('Tasks')
      const newData = [] as (string | string[] | DataTablePropsEntry)[][]
      tasks.forEach((tsk: Task) => {
        if (tsk.ID) {
          newData.push(
            [
              { link: '/task/' + tsk.ID, value: tsk.ID }
              , { link: '/service/' + tsk.ServiceID, value: ((tsk.ServiceID && services.get(tsk.ServiceID)?.Spec?.Name) ?? tsk.ServiceID) + '.' + (tsk.Slot ? tsk.Slot : tsk.NodeID) }
              , { link: '/node/' + tsk.NodeID, value: (nodes && tsk.NodeID && nodes.get(tsk.NodeID)?.Description?.Hostname || tsk.NodeID || '') } 
              , tsk.CreatedAt || ''
              , tsk.Spec?.ContainerSpec?.Image?.replace(/@.*/, '') || ''              
              , tsk.DesiredState || ''
              , tsk.Status?.State || ''
              , tsk.Status?.Err || ''
              , tsk.Status?.PortStatus?.Ports?.map(portSpec => {
                return portSpec.PublishedPort + ':' + portSpec.TargetPort
              }) || ''
              ,
            ]
          )
        }
      });      
      setData(newData)
    }
}, [tasks, services, nodes, props])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Paper>
          <DataTable id="tasks" headers={['ID', 'NAME', 'NODE', 'CREATED', 'IMAGE', 'DESIRED STATE', 'CURRENT STATE', 'ERROR', 'PORTS']} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Tasks;