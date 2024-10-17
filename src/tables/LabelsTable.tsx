import MaterialTable from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';

export interface LabelDetails {
  id: string
  value?: string
}
const labelColumns: MRT_ColumnDef<LabelDetails>[] = [
  {
    accessorKey: 'id',
    header: 'NAME',
    size: 220,
  },
  {
    accessorKey: 'value',
    header: 'VALUE',
    size: 220,
  },
]

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
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function createLabelDetails(name: string, value?: string): LabelDetails {
  return {
    id: name
    , value: value
  }
}

export default LabelsTable;