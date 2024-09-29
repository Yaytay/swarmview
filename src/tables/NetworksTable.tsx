import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Network } from '../docker-schema';
import { Dimensions } from '../app-types';

export interface NetworkDetails {
  id: string
  name?: string
  driver?: string
  scope?: string
  encrypted?: string
}
const networkColumns: MRT_ColumnDef<NetworkDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/network/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 400,
  },
  {
    accessorKey: 'driver',
    header: 'DRIVER',
    size: 150,
  },
  {
    accessorKey: 'scope',
    header: 'SCOPE',
    size: 160,
  },
  {
    accessorKey: 'encrypted',
    header: 'ENCRYPTED',
    size: 180,
  },
]

interface NetworksTableProps {
  id: string
  networks: NetworkDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function NetworksTable(props: NetworksTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={networkColumns}
      data={props.networks}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createNetworkDetails(net: Network): NetworkDetails {
  return {
    id: net.Id || ''
    , name: net.Name
    , driver: net.Driver
    , scope: net.Scope
    , encrypted: net?.Options?.encrypted
  }
}

export default NetworksTable;