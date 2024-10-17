import MaterialTable, { MaterialTableState } from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';
import { IPAMConfig } from '../docker-schema';

export interface IpamConfigDetails {
  id: string
  subnet?: string
  ipRange?: string
  gateway?: string
  auxiliaryAddresses?: string
}
const labelColumns: MRT_ColumnDef<IpamConfigDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
  },
  {
    accessorKey: 'subnet',
    header: 'SUBNET',
    size: 220,
  },
  {
    accessorKey: 'iprange',
    header: 'IP RANGE',
    size: 220,
  },
  {
    accessorKey: 'gateway',
    header: 'GATEWAY',
    size: 220,
  },
  {
    accessorKey: 'a',
    header: 'AUXILIARY ADDRESSES',
    size: 220,
  },
]

const defaultState: MaterialTableState = {
  columnFilters: []
  , columnOrder: labelColumns.map((c) => c.accessorKey as string)
  , columnVisibility: { id: false }
  , columnSizing: {}
  , density: 'compact'
  , showColumnFilters: false
  , showGlobalFilter: false
  , sorting: []
}

interface IpamConfigsTableProps {
  id: string
  ipams: IpamConfigDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function IpamConfigsTable(props: IpamConfigsTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={labelColumns}
      data={props.ipams}
      border={props.border}
      virtual={false}
      defaultState={defaultState}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createIpamConfigDetails(config: IPAMConfig): IpamConfigDetails {
  const auxAddresses = config.AuxiliaryAddresses ? JSON.stringify(config.AuxiliaryAddresses) : ''
  return {
    id: (config.Subnet || '').concat('#', config.IPRange || '', '#', config.Gateway || '', '#', auxAddresses)
    , subnet: config.Subnet
    , ipRange: config.IPRange
    , gateway: config.Gateway
    , auxiliaryAddresses: auxAddresses
  }
}

export default IpamConfigsTable;