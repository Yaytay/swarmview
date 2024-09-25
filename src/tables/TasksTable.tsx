import { MRT_ColumnDef } from 'material-react-table';
import MaterialTable, { MaterialTableState } from '../MaterialTable';
import { Link } from 'react-router-dom';
import * as duration from 'duration-fns'
import { Dimensions } from '../app-types';
import { Service, Task } from '../docker-schema';

export interface TaskDetails {
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

interface TasksTableProps {
  id: string
  tasks: TaskDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function TasksTable(props: TasksTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={taskColumns}
      data={props.tasks}
      border={props.border}
      virtual={false}
      defaultState={defaultState}
      muiTableContainerProps={props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createTaskDetails(task: Task, servicesById: Map<string, Service>, exposedPorts: Record<string, string[]>, nowMs: number): TaskDetails {
  const ports = (task.Status?.PortStatus?.Ports?.map(portSpec => {
    return portSpec.PublishedPort + ':' + portSpec.TargetPort
  }) || []).concat(
    task.Spec?.ContainerSpec?.Image ? exposedPorts[task.Spec.ContainerSpec.Image.replace(/:.*@/, "@")] : []
  ).filter(Boolean).join(', ')
  const age = task.CreatedAt ? ~~((nowMs - new Date(task.CreatedAt).getTime()) / 1000) : 0

  return {
    id: task.ID || ''
    , stack: task.Spec?.ContainerSpec?.Labels && task.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'] || ''
    , service: (servicesById && task.ServiceID) ? servicesById.get(task.ServiceID)?.Spec?.Name || '' : ''
    , serviceId: task.ServiceID || ''
    , created: task.CreatedAt || ''
    , age: age
    , image: task.Spec?.ContainerSpec?.Image?.replace(/@.*/, '') || ''
    , desiredState: task.DesiredState || ''
    , currentState: task.Status?.State || ''
    , error: task.Status?.Err || ''
    , memory: String(task?.Status?.State === 'running' && task?.Spec?.Resources?.Limits?.MemoryBytes ? task?.Spec?.Resources?.Limits?.MemoryBytes / 1048576 : '')
    , ports: ports
  }
}

export default TasksTable;