import Box from '@mui/material/Box';
import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Service } from '../docker-schema';
import { Dimensions } from '../app-types';

export interface ServiceDetails {
  id: string
  name: string
  mode: string
  replicas: string
  image: string
  ports?: string
}

const serviceColumns: MRT_ColumnDef<ServiceDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 200,
    Cell: ({ renderedCellValue, row }) =>
      (<Link to={"/service/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 300,
    Cell: ({ renderedCellValue }) =>
      (<Box sx={{ textWrap: 'wrap' }} >{renderedCellValue}</Box>)
  },
  {
    accessorKey: 'mode',
    header: 'MODE',
    size: 150,
  },
  {
    accessorKey: 'replicas',
    header: 'REPLICAS',
    size: 150,
  },
  {
    accessorKey: 'image',
    header: 'IMAGE',
    size: 400,
    grow: true,
    Cell: ({ renderedCellValue }) =>
      (<Box sx={{ textWrap: 'wrap' }} >{renderedCellValue}</Box>)
  },
  {
    accessorKey: 'ports',
    header: 'PORTS',
    size: 150,
    Cell: ({ renderedCellValue }) =>
      (<Box sx={{ textWrap: 'wrap' }} >{renderedCellValue}</Box>)
  },
]

interface ServicesTableProps {
  id: string
  services: ServiceDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function ServicesTable(props: ServicesTableProps) {
  return (
    <MaterialTable
      id={props.id}
      columns={serviceColumns}
      data={props.services}
      border={props.border}
      virtual={false}
      muiTableContainerProps={ props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
    />
  )
}

function createPortsDetail(svc: Service, exposedPorts: Record<string, string[]>): string[] {
  return (svc.Endpoint?.Ports?.map(portSpec => {
    return (portSpec.PublishedPort ? portSpec.PublishedPort + ':' : '') + portSpec.TargetPort
  }) || []).concat(
    svc.Spec?.TaskTemplate?.ContainerSpec?.Image ? exposedPorts[svc.Spec.TaskTemplate?.ContainerSpec.Image.replace(/:.*@/, "@")] : []
  ).filter(Boolean)
}

export function createServiceDetails(svc: Service, exposedPorts: Record<string, string[]>): ServiceDetails {
  return {
    id: svc.ID || '',
    name: svc.Spec?.Name || '',
    mode: Object.keys(svc.Spec?.Mode || [''])[0],
    replicas: svc.ServiceStatus?.RunningTasks + ' / ' + svc.ServiceStatus?.DesiredTasks,
    image: svc.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || '',
    ports: createPortsDetail(svc, exposedPorts).join(', ')
  };
}

export default ServicesTable;