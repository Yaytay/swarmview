import MaterialTable, { MaterialTableState } from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';

export interface PluginDetails {
  id: string
  type: string
  name: string
}
const pluginColumns: MRT_ColumnDef<PluginDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
    size: 220,
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 220,
  },
]

const defaultState: MaterialTableState = {
  columnFilters: []
  , columnOrder: pluginColumns.map((c) => c.accessorKey as string)
  , columnVisibility: { id: false }
  , columnSizing: {}
  , density: 'compact'
  , showColumnFilters: false
  , showGlobalFilter: false
  , sorting: []
}

interface PluginsTableProps {
  id: string
  plugins: PluginDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function PluginsTable(props: PluginsTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={pluginColumns}
      data={props.plugins}
      border={props.border}
      defaultState={defaultState}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createPluginDetails(type: string, name: string): PluginDetails {
  return {
    id: type + '#' + name
    , type: type
    , name: name
  }
}

export default PluginsTable;