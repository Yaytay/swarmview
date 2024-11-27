import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { EndpointSettings, Network, NetworkAttachmentConfig } from '../docker-schema';
import { Dimensions } from '../app-types';

export interface NetworkAttachmentDetails {
  id: string
  name?: string
  aliases?: string
  address?: string
  driver?: string
  scope?: string
  encrypted?: string
}
const networkColumns: MRT_ColumnDef<NetworkAttachmentDetails>[] = [
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
    accessorKey: 'aliases',
    header: 'ALIASES',
    size: 400,
  },
  {
    accessorKey: 'address',
    header: 'ADDRESS',
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

interface NetworkAttachmentsTableProps {
  id: string
  networks: NetworkAttachmentDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function NetworkAttachmentsTable(props: NetworkAttachmentsTableProps) {
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

export function createNetworkAttachmentDetails(net: Network, attachment?: NetworkAttachmentConfig, endpoint?: EndpointSettings): NetworkAttachmentDetails {

  return {
    id: net.Id || ''
    , name: net.Name
    , aliases: attachment?.Aliases?.join(', ') || ''
    , address: endpoint?.IPAddress || ''
    , driver: net.Driver
    , scope: net.Scope
    , encrypted: net?.Options?.encrypted
  }
}

export default NetworkAttachmentsTable;