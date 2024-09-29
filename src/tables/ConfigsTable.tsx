import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Config, Service } from '../docker-schema';
import { Dimensions, IdName } from '../app-types';
import * as duration from 'duration-fns'
import Box from '@mui/system/Box';


export interface ConfigDetails {
  id: string
  name?: string
  created?: string
  age: number
  services?: IdName[]
}
const configColumns: MRT_ColumnDef<ConfigDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/config/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 400,
  },
  {
    accessorKey: 'created',
    header: 'CREATED',
    size: 150,
  },
  {
    accessorKey: 'age',
    header: 'AGE',
    size: 180,
    Cell: ({ row }) => duration.toString(duration.normalize(row.original.age * 1000))
  },
  {
    accessorKey: 'services',
    header: 'SERVICES',
    size: 160,
    Cell: ({ row }) => (<Box style={{ display: "inline-block", whiteSpace: "pre-line" }}>{row.original.services?.map(svc => (<><Link key={svc.id} to={"/service/" + svc.id} >{svc.name}</Link><br/></>))}</Box>)
    // Cell: ({ row }) => (<></>)
  },
]

interface ConfigsTableProps {
  id: string
  configs: ConfigDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function ConfigsTable(props: ConfigsTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={configColumns}
      data={props.configs}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function buildServicesByConfig(services: Service[]): Map<string, Service[]> {
  return services.reduce((result, current) => {
    current.Spec?.TaskTemplate?.ContainerSpec?.Configs?.forEach(svcCnf => {
      if (svcCnf.ConfigID) {
        let svcConfigs = result.get(svcCnf.ConfigID)
        if (!svcConfigs) {
          svcConfigs = []
          result.set(svcCnf.ConfigID, svcConfigs)
        }
        svcConfigs.push(current)
      }
    })
    return result
  }, new Map<string, Service[]>())
}

export function createConfigDetails(cnf: Config, servicesByConfig: Map<string, Service[]>, nowMs: number): ConfigDetails {
  const services = cnf.ID && servicesByConfig?.get(cnf.ID) || []

  const cnfSvcs = services.reduce((result, current) => {
    if (current.ID) {
      result.push({ id: current.ID, name: current.Spec?.Name || current.ID || '' })
    }
    return result
  }, [] as IdName[])

  const age = cnf.CreatedAt ? ~~((nowMs - new Date(cnf.CreatedAt).getTime()) / 1000) : 0

  return {
    id: cnf.ID || ''
    , name: cnf.Spec?.Name
    , created: cnf.CreatedAt
    , age: age
    , services: cnfSvcs
  }
}

export default ConfigsTable;