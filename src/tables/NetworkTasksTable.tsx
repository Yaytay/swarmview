import { MRT_ColumnDef } from 'material-react-table';
import MaterialTable, { MaterialTableState } from '../MaterialTable';
import { Link } from 'react-router-dom';
import * as duration from 'duration-fns'
import { Dimensions } from '../app-types';
import { Service, Task, Node, Network } from '../docker-schema';
import { ContainerData } from '../DockerApi';

export interface NetworkTaskDetails {
  id: string
  name: string
  stack: string
  service: string
  serviceId: string
  node: string
  nodeId: string
  created?: string
  age: number
  aliases: string
  address: string
  ports?: string
}

const taskColumns: MRT_ColumnDef<NetworkTaskDetails>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
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
    accessorKey: 'node',
    header: 'NODE',
    size: 230,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/node/" + row.original.nodeId} >{renderedCellValue}</Link>)
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
    accessorKey: 'aliases',
    header: 'ALIASES',
    size: 600,
  },
  {
    accessorKey: 'address',
    header: 'ADDRESS',
    size: 100,
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

interface NetworkTasksTableProps {
  id: string
  tasks: NetworkTaskDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function NetworkTasksTable(props: NetworkTasksTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={taskColumns}
      data={props.tasks}
      border={props.border}
      virtual={true}
      defaultState={defaultState}
      muiTableContainerProps={props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createNetworkTaskDetails(net: Network
  , task: Task
  , servicesById: Map<string, Service>
  , nodesById: Map<string, Node>
  , exposedPorts: Record<string, string[]>
  , containers: ContainerData[]
  , nowMs: number
): NetworkTaskDetails {
  const ports = (task.Status?.PortStatus?.Ports?.map(portSpec => {
    return portSpec.PublishedPort + ':' + portSpec.TargetPort
  }) || []).concat(
    task.Spec?.ContainerSpec?.Image ? exposedPorts[task.Spec.ContainerSpec.Image.replace(/:.*@/, "@")] : []
  ).filter(Boolean).join(', ')
  const age = task.CreatedAt ? ~~((nowMs - new Date(task.CreatedAt).getTime()) / 1000) : 0

  const stack = task.Spec?.ContainerSpec?.Labels && task.Spec?.ContainerSpec?.Labels['com.docker.stack.namespace'] || ''
  const service = (servicesById && task.ServiceID) ? servicesById.get(task.ServiceID)?.Spec?.Name || '' : ''
  const name = service + '.' + (task.Slot || task.NodeID)

  const node = (nodesById && task.NodeID) ? nodesById.get(task.NodeID)?.Description?.Hostname || task.NodeID : task.NodeID || ''

  const ctr = containers?.find(ctr => ctr.container?.Config?.Labels?.['com.docker.swarm.task.id'] === task.ID)

  return {
    id: task.ID || ''
    , name: name
    , stack: stack
    , service: service
    , serviceId: task.ServiceID || ''
    , node: node
    , nodeId: task.NodeID || ''
    , created: task.CreatedAt || ''
    , age: age
    , ports: ports
    , aliases: ([] as string[])
        .concat(ctr?.container?.NetworkSettings?.Networks?.[net?.Name || '']?.Aliases || [])
        .concat(ctr?.container?.NetworkSettings?.Networks?.[net?.Name || '']?.DNSNames || [])
        .join(', ')
    , address: ctr?.container?.NetworkSettings?.Networks?.[net?.Name || '']?.IPAddress ||''
  }
}

export default NetworkTasksTable;