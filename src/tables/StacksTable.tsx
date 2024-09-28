import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';

export interface StackDetails {
  name: string
  services: number
  networks: number
}

const stackColumns: MRT_ColumnDef<StackDetails>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 300,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/stack/" + row.original.name} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'services',
    header: 'SERVICES',
    size: 200,
  },
  {
    accessorKey: 'networks',
    header: 'NETWORKS',
    size: 200,
  },
]

interface StacksTableProps {
  id: string
  stacks: StackDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function StacksTable(props: StacksTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={stackColumns}
      data={props.stacks}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export default StacksTable;