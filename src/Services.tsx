import { useState, useEffect } from 'react';
import { Service } from './docker-schema'
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import { DockerApi } from './DockerApi';
import MaterialTable from './MaterialTable';
import { Link } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';

interface ServiceDetails {
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
    size: 1,
    Cell: ({ renderedCellValue, row }) =>
      (<Link to={"/service/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 1,
  },
  {
    accessorKey: 'mode',
    header: 'MODE',
    size: 1,
  },
  {
    accessorKey: 'replicas',
    header: 'REPLICAS',
    size: 1,
  },
  {
    accessorKey: 'image',
    header: 'IMAGE',
    size: 1,
  },
  {
    accessorKey: 'ports',
    header: 'PORTS',
    size: 1,
  },
]



interface ServicesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Services(props: ServicesProps) {

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])
  const [services, setServices] = useState<Service[]>()
  const [exposedPorts, setExposedPorts] = useState<Record<string, string[]>>()

  useEffect(() => {
    props.docker.exposedPorts()
      .then(ports => {
        setExposedPorts(ports)
      })
    props.docker.services()
      .then(svcs => {
        setServices(svcs)
      })
    props.setTitle('Services')
  }, [props])

  useEffect(() => {
    setServiceDetails(
      services?.reduce((result, current) => {
        result.push(
          {
            id : current.ID || ''
            , name: current.Spec?.Name || ''
            , mode: Object.keys(current.Spec?.Mode || [''])[0]
            , replicas: current.ServiceStatus?.RunningTasks + ' / ' + current.ServiceStatus?.DesiredTasks
            , image: current.Spec?.TaskTemplate?.ContainerSpec?.Image?.replace(/@.*/, '') || ''
            , ports: current.Endpoint?.Ports?.map((p) => {
              return p.PublishedPort + ':' + p.TargetPort
            }).join(', ') || ''          
          }
        )
        return result;
      }, [] as ServiceDetails[]) || []
    )
  }, [exposedPorts, services])

  return (<>
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container >
        <MaterialTable id="services" columns={serviceColumns} data={serviceDetails} />
      </Grid2>
    </Box>
  </>)


}

export default Services;