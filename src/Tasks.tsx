import { useState, useEffect } from 'react';
import { Service, Task, Node } from './docker-schema'
import Box from '@mui/material/Box';
import { DockerApi } from './DockerApi';
import { MRT_ColumnDef } from 'material-react-table';
import { Grid2 } from '@mui/material';
import MaterialTable from './MaterialTable';

interface TaskDetails {
  id: string
  created?: string
  image: string
  desiredState?: string
  currentState?: string
  error?: string
  memory?: string
  ports?: string
}

const taskColumns : MRT_ColumnDef<TaskDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 1,
  },
  {
    accessorKey: 'created',
    header: 'CREATED',
    size: 1,
  },
  {
    accessorKey: 'image',
    header: 'IMAGE',
    filterVariant: 'select',
    size: 1,
  },
  {
    accessorKey: 'desiredState',
    header: 'DESIRED STATE',
    filterVariant: 'select',
    size: 1,
  },
  {
    accessorKey: 'currentState',
    header: 'CURRENT STATE',
    filterVariant: 'select',
    size: 1,
  },
  {
    accessorKey: 'error',
    header: 'ERROR',
    size: 1,
  },
  {
    accessorKey: 'memory',
    header: 'MEMORY',
    filterVariant: 'select',
    size: 1,
  },
  {
    accessorKey: 'ports',
    header: 'PORTS',
    filterVariant: 'select',
    size: 1,
  },
]

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Tasks(props: TasksProps) {

  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map<string, Service>())
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map<string, Node>())

  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])

  useEffect(() => {
    props.docker.tasks()
      .then(j => {
        setTasks(j)
      })

    props.docker.services()
      .then(svcs => {
        setServices(svcs.reduce((result, current) => { 
          if (current.ID) {
            result.set(current.ID, current)
          }
          return result
        }, new Map<string, Service>()))
      })

    props.docker.nodes()
      .then(nods => {
        setNodes(nods.reduce((result, current) => {
          if (current.ID) {
            result.set(current.ID, current)
          }
          return result
        }, new Map<string, Node>()))
      })
    props.setTitle('Tasks')
  }, [props])

  useEffect(() => {
    setTaskDetails(
      tasks.reduce((result, current) => {
        if (current.ID) {
          result.push({
            id: current.ID
            , created: current.CreatedAt || ''
            , image: current.Spec?.ContainerSpec?.Image?.replace(/@.*/, '') || ''
            , desiredState: current.DesiredState || ''
            , currentState: current.Status?.State || ''
            , error: current.Status?.Err || ''
            , memory: String(current?.Status?.State === 'running' && current?.Spec?.Resources?.Limits?.MemoryBytes ? current?.Spec?.Resources?.Limits?.MemoryBytes / 1048576 : '')
            , ports: current.Status?.PortStatus?.Ports?.map(portSpec => {
              return portSpec.PublishedPort + ':' + portSpec.TargetPort
            })?.join() || ''
          })
        }
        return result
      }, [] as TaskDetails[]
      )
    )
  }, [tasks, services, nodes, props])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container sx={{ overflowX: 'auto', overflowY: 'visible' }}>
        <MaterialTable id="tasks" columns={taskColumns} data={taskDetails} />
      </Grid2>
    </Box>
  </>)


}

export default Tasks;