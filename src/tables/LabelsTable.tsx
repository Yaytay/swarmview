import MaterialTable, { MaterialTableState } from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';

export interface LabelDetails {
  id: string
  source?: string
  name: string
  value?: string
}
const labelColumns: MRT_ColumnDef<LabelDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 220,
  },
  {
    accessorKey: 'value',
    header: 'VALUE',
    size: 220,
  },
  {
    accessorKey: 'source',
    header: 'SOURCE',
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

interface LabelsTableProps {
  id: string
  labels: LabelDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function LabelsTable(props: LabelsTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={labelColumns}
      data={props.labels}
      border={props.border}
      defaultState={defaultState}
      virtual={false}
      muiTableContainerProps={props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createLabelDetails(source: string, name: string, value?: string): LabelDetails {
  return {
    id: (source || '') + '#' + name
    , name: name
    , source: source
    , value: value
  }
}

export function createLabels(labels: LabelDetails[], record: Record<string, string> | undefined, source: string) {
  if (record) {
    labels = labels.concat(Object.keys(record).reduce((result, current) => {
      result.push(createLabelDetails(source, current, record[current]));
      return result;
    }, [] as LabelDetails[]));
  }
  return labels;
}

export default LabelsTable;