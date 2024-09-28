import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Node } from '../docker-schema';
import { Dimensions } from '../app-types';

export interface NodeDetails {
  id: string
  name?: string
  state?: string
  availability?: string
  managerStatus?: string
  engineVersion?: string
}
const nodeColumns: MRT_ColumnDef<NodeDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/node/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 220,
  },
  {
    accessorKey: 'state',
    header: 'STATE',
    size: 220,
  },
  {
    accessorKey: 'availability',
    header: 'AVAILABILITY',
    size: 220,
  },
  {
    accessorKey: 'managerStatus',
    header: 'MANAGER STATUS',
    size: 220,
  },
  {
    accessorKey: 'engineVersion',
    header: 'ENGINE VERSION',
    size: 220,
  },

]

interface NodesTableProps {
  id: string
  nodes: NodeDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function NodesTable(props: NodesTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={nodeColumns}
      data={props.nodes}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createNodeDetails(nod: Node): NodeDetails {
  return {
    id: nod.ID || ''
    , name: nod.Description?.Hostname
    , state: nod.Status?.State
    , availability: nod.Spec?.Availability
    , managerStatus: nod.ManagerStatus?.Leader ? 'leader' : nod.ManagerStatus?.Reachability
    , engineVersion: nod.Description?.Engine?.EngineVersion
  }
}

export default NodesTable;