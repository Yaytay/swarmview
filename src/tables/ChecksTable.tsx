import MaterialTable from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';
import { Check, CheckResult, State } from '../checks/checks';
import { Tooltip } from '@mui/material';

export interface CheckDetails {
  id: string
  check: string
  description: string
  result?: string
  value?: number
  threshold?: number
  message?: string
}
const checkColumns: MRT_ColumnDef<CheckDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
  },
  {
    accessorKey: 'check',
    header: 'CHECK',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Tooltip placement="bottom-start" title={row.original.description}><span>{renderedCellValue}</span></Tooltip>)
  },
  {
    accessorKey: 'result',
    header: 'RESULT',
    size: 220,
  },
  {
    accessorKey: 'value',
    header: 'VALUE',
    size: 100,
  },
  {
    accessorKey: 'threshold',
    header: 'THRESOLD',
    size: 100,
  },
  {
    accessorKey: 'message',
    header: 'MESSAGE',
    size: 400,
  },
]

interface ChecksTableProps {
  id: string
  checks: CheckDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function ChecksTable(props: ChecksTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={checkColumns}
      data={props.checks}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
      muiTableBodyRowProps={ ({row}) => {
        switch(row.original.result) {
          case State.error:
            return { sx: { backgroundColor: 'chocolate' } }
          case State.warning:
            return { sx: { backgroundColor: 'yellow' } }
          case State.fail:
            return { sx: { backgroundColor: 'red' } }
          default:
            return {}
        }
       } }
    />
  )
}

export function createCheckDetails(check: Check, result: CheckResult): CheckDetails {
  return {
    id: check.id
    , check: check.title
    , description: check.description
    , result: result.state
    , value: result.value
    , threshold: result.threshold
    , message: result.message
  }
}

export default ChecksTable;