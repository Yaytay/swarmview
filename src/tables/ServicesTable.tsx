import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import MaterialTable from '../MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import { Service } from '../docker-schema';

export interface ServiceDetails {
  id: string
  name: string
  mode: string
  replicas: string
  image: string
  ports?: string
}

const serviceColumns : MRT_ColumnDef<ServiceDetails>[] = [
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

interface ServicesProps {
  id: string
  services: ServiceDetails[]
}
function ServicesTable(props: ServicesProps) {
  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container >
        <MaterialTable id="services" columns={serviceColumns} data={props.services} border={false} />
      </Grid2>
    </Box>
  </>)
}

export function createServiceDetails(svc: Service, exposedPorts: Record<string, string[]>): ServiceDetails {
  const ports = (svc.Endpoint?.Ports?.map(portSpec => {
    return portSpec.PublishedPort + ':' + portSpec.TargetPort
  }) || []).concat(
    svc.Spec?.TaskTemplate?.ContainerSpec?.Image ? exposedPorts[svc.Spec.TaskTemplate?.ContainerSpec.Image.replace(/:.*@/, "@")] : []
  ).filter(Boolean).join(', ')

  return {
    id: svc.ID || '',
    name: svc.Spec?.Name || '',
    mode: Object.keys(svc.Spec?.Mode || [''])[0],
    replicas: svc.ServiceStatus?.RunningTasks + ' / ' + svc.ServiceStatus?.DesiredTasks,
    image: svc.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || '',
    ports: ports
  };
}

export default ServicesTable;