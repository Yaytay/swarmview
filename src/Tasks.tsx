import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { MRT_ColumnDef } from 'material-react-table';
import MaterialTable, { MaterialTableState } from './MaterialTable';
import { Link } from 'react-router-dom';
import * as duration from 'duration-fns'
import { Dimensions } from './app-types';

interface TaskDetails {
  id: string
  stack: string
  service: string
  serviceId: string
  created?: string
  age: number
  image: string
  desiredState?: string
  currentState?: string
  error?: string
  memory?: string
  ports?: string
}

const taskColumns: MRT_ColumnDef<TaskDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/task/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'stack',
    header: 'STACK',
    size: 180,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/stack/" + row.original.stack} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'service',
    header: 'SERVICE',
    size: 230,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/service/" + row.original.serviceId} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'created',
    header: 'CREATED',
    size: 180,
  },
  {
    accessorKey: 'age',
    header: 'AGE',
    size: 180,
    Cell: ({ row }) => (duration.toString(duration.normalize(row.original.age * 1000)))
  },
  {
    accessorKey: 'image',
    header: 'IMAGE',
    filterVariant: 'select',
    size: 600,
  },
  {
    accessorKey: 'desiredState',
    header: 'DESIRED STATE',
    filterVariant: 'select',
    size: 100,
  },
  {
    accessorKey: 'currentState',
    header: 'CURRENT STATE',
    filterVariant: 'select',
    size: 100,
  },
  {
    accessorKey: 'error',
    header: 'ERROR',
    size: 180,
  },
  {
    accessorKey: 'memory',
    header: 'MEMORY',
    filterVariant: 'select',
    size: 180,
  },
  {
    accessorKey: 'ports',
    header: 'PORTS',
    filterVariant: 'select',
    size: 300,
    Cell: ({ renderedCellValue }) => <div className="text-wrap">{renderedCellValue}</div>
  },
]

const defaultState: MaterialTableState = {
  columnFilters: []
  , columnOrder: taskColumns.map((c) => c.accessorKey as string)
  , columnVisibility: { error: false, memory: false, created: false }
  , columnSizing: {}
  , density: 'compact'
  , showColumnFilters: false
  , showGlobalFilter: false
  , sorting: []
}

interface TasksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Tasks(props: TasksProps) {

  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])

  useEffect(() => {
    console.log(Date.now(), 'Getting data', props)
    props.setTitle('Tasks')

    Promise.all([
      props.docker.exposedPorts()
      , props.docker.tasks()
      , props.docker.servicesById()
      , props.docker.nodesById()
    ]).then(value => {
      const nowMs = Date.now()
      const exposedPorts = value[0]
      const tasks = value[1]
      const services = value[2]
      const nodes = value[3]

      console.log(Date.now(), 'Got', tasks, services, nodes, exposedPorts)
      const tsks = tasks.reduce((result, current) => {
        if (current.ID) {
          const ports = (current.Status?.PortStatus?.Ports?.map(portSpec => {
            return portSpec.PublishedPort + ':' + portSpec.TargetPort
          }) || []).concat(
            current.Spec?.ContainerSpec?.Image ? exposedPorts[current.Spec.ContainerSpec.Image.replace(/:.*@/, "@")] : []
          ).filter(Boolean).join(', ')
          const age = current.CreatedAt ? ~~((nowMs - new Date(current.CreatedAt).getTime()) / 1000) : 0

          result.push({
            id: current.ID
            , stack: current.Spec?.ContainerSpec?.Labels && current.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'] || ''
            , service: (services && current.ServiceID) ? services.get(current.ServiceID)?.Spec?.Name || '' : ''
            , serviceId: current.ServiceID || ''
            , created: current.CreatedAt || ''
            , age: age
            , image: current.Spec?.ContainerSpec?.Image?.replace(/@.*/, '') || ''
            , desiredState: current.DesiredState || ''
            , currentState: current.Status?.State || ''
            , error: current.Status?.Err || ''
            , memory: String(current?.Status?.State === 'running' && current?.Spec?.Resources?.Limits?.MemoryBytes ? current?.Spec?.Resources?.Limits?.MemoryBytes / 1048576 : '')
            , ports: ports
          })
        }
        return result
      }, [] as TaskDetails[])
      console.log(Date.now(), 'Set task details', tsks)
      setTaskDetails(tsks)
    })
  }, [props])

  return (
    <MaterialTable id="tasks"
      columns={taskColumns}
      data={taskDetails}
      defaultState={defaultState}
      virtual={true}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )

}

export default Tasks;