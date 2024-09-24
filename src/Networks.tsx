import { useState, useEffect } from 'react';
import { Network } from './docker-schema'
import { DockerApi } from './DockerApi';
import { MRT_ColumnDef } from 'material-react-table';
import { Link } from 'react-router-dom';
import MaterialTable from './MaterialTable';

interface NetworkDetails {
  id: string
  name?: string
  driver?: string
  scope?: string
  encrypted?: string
}
const networkColumns: MRT_ColumnDef<NetworkDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/network/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 400,
  },
  {
    accessorKey: 'driver',
    header: 'DRIVER',
    size: 150,
  },
  {
    accessorKey: 'scope',
    header: 'SCOPE',
    size: 160,
  },
  {
    accessorKey: 'encrypted',
    header: 'ENCRYPTED',
    size: 180,
  },
]

const heightOffset = 128

interface NetworksProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Networks(props: NetworksProps) {

  const [networks, setNetworks] = useState<NetworkDetails[]>([])
  const [maxHeight, setMaxHeight] = useState<Number>(window.innerHeight - heightOffset)
  const [maxWidth, setMaxWidth] = useState<Number>(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setMaxHeight(window.innerHeight - heightOffset);
      setMaxWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    props.setTitle('Networks')
    props.docker.networks()
      .then(j => {
        setNetworks(
          j.reduce((result: NetworkDetails[], net: Network) => {
            if (net.Id) {
              result.push(
                {
                  id: net.Id
                  , name: net.Name
                  , driver: net.Driver
                  , scope: net.Scope
                  , encrypted: net?.Options?.encrypted
                }
              )
            }
            return result
          }, [] as NetworkDetails[])
        )
      })
  }, [props])

  return (
    <MaterialTable id="networks"
      columns={networkColumns}
      data={networks}
      virtual={true}
      muiTableContainerProps={{ sx: { maxHeight: maxHeight + 'px', maxWidth: maxWidth + 'px' } }}
    />
  )
}

export default Networks;