import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Secret, Service } from '../docker-schema';
import { Dimensions, IdName } from '../app-types';
import * as duration from 'duration-fns'
import Box from '@mui/system/Box';


export interface SecretDetails {
  id: string
  name?: string
  created?: string
  age: number
  services?: IdName[]
}
const secretColumns: MRT_ColumnDef<SecretDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/secret/" + row.original.id} >{renderedCellValue}</Link>)
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
  },
]

interface SecretsTableProps {
  id: string
  secrets: SecretDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function SecretsTable(props: SecretsTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={secretColumns}
      data={props.secrets}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

export function buildServicesBySecret(services: Service[]): Map<string, Service[]> {
  return services.reduce((result, current) => {
    current.Spec?.TaskTemplate?.ContainerSpec?.Secrets?.forEach(svcCnf => {
      if (svcCnf.SecretID) {
        let svcSecrets = result.get(svcCnf.SecretID)
        if (!svcSecrets) {
          svcSecrets = []
          result.set(svcCnf.SecretID, svcSecrets)
        }
        svcSecrets.push(current)
      }
    })
    return result
  }, new Map<string, Service[]>())
}

export function createSecretDetails(sec: Secret, servicesBySecret: Map<string, Service[]>, nowMs: number): SecretDetails {
  const services = sec.ID && servicesBySecret?.get(sec.ID) || []

  const cnfSvcs = services.reduce((result, current) => {
    if (current.ID) {
      result.push({ id: current.ID, name: current.Spec?.Name || current.ID || '' })
    }
    return result
  }, [] as IdName[])

  const age = sec.CreatedAt ? ~~((nowMs - new Date(sec.CreatedAt).getTime()) / 1000) : 0

  return {
    id: sec.ID || ''
    , name: sec.Spec?.Name
    , created: sec.CreatedAt
    , age: age
    , services: cnfSvcs
  }
}

export default SecretsTable;