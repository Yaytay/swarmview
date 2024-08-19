import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry } from './DataTable';
import { Service, Task, Node } from './docker-schema'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DockerApi } from './DockerApi';

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
}
function Tasks(props: TasksProps) {

  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map<string, Service>())
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map<string, Node>())

  const [data, setData] = useState<(string | string[] | number | DataTablePropsEntry)[][]>()

  useEffect(() => {
    props.docker.tasks()
      .then(j => {
        setTasks(j)
      })

    props.docker.services()
      .then(svcs => {
        const buildServices = new Map<string, Service>()
        svcs.forEach(svc => {
          if (svc.ID) {
            buildServices.set(svc.ID, svc)
          }
        })
        setServices(buildServices)
      })

    props.docker.nodes()
      .then(nods => {
        const buildNodes = new Map<string, Node>()
        nods.forEach(nod => {
          if (nod.ID) {
            buildNodes.set(nod.ID, nod)
          }
        })
        setNodes(buildNodes)
      })
  }, [props.baseUrl])

  useEffect(() => {
    if (tasks && services) {
      props.setTitle('Tasks')
      const newData = [] as (string | string[] | number | DataTablePropsEntry)[][]
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
              , tsk?.Status?.State === 'running' && tsk?.Spec?.Resources?.Limits?.MemoryBytes ? tsk?.Spec?.Resources?.Limits?.MemoryBytes / 1048576 : ''
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
          <DataTable id="tasks" headers={['ID', 'NAME', 'NODE', 'CREATED', 'IMAGE', 'DESIRED STATE', 'CURRENT STATE', 'MEMORY', 'ERROR', 'PORTS']} rows={data}>
          </DataTable>
        </Paper>
      </Grid>
    </Box>
  </>)


}

export default Tasks;