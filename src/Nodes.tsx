import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { MRT_ColumnDef } from 'material-react-table';
import { Link } from 'react-router-dom';
import MaterialTable from './MaterialTable';

interface NodeDetails {
  id: string
  name?: string
  state?: string
  availability?: string
  managerStatus?: string
  engineVersion?: string
}
const nodeColumns: MRT_ColumnDef<NodeDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 220,
    Cell: ({ renderedCellValue, row }) => (<Link to={"/node/" + row.original.id} >{renderedCellValue}</Link>)
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    size: 220,
  },
  {
    accessorKey: 'state',
    header: 'STATE',
    size: 220,
  },
  {
    accessorKey: 'availability',
    header: 'AVAILABILITY',
    size: 220,
  },
  {
    accessorKey: 'managerStatus',
    header: 'MANAGER STATUS',
    size: 220,
  },
  {
    accessorKey: 'engineVersion',
    header: 'ENGINE VERSION',
    size: 220,
  },

]

interface NodesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
function Nodes(props: NodesProps) {

  const [nodes, setNodes] = useState<NodeDetails[]>([])

  useEffect(() => {
    props.setTitle('Nodes')
    props.docker.nodes()
      .then(j => {
        setNodes(
          j.reduce((result, nod) => {
            if (nod.ID) {
              result.push({
                id: nod.ID
                , name: nod.Description?.Hostname
                , state: nod.Status?.State
                , availability: nod.Spec?.Availability
                , managerStatus: nod.ManagerStatus?.Leader ? 'leader' : nod.ManagerStatus?.Reachability
                , engineVersion: nod.Description?.Engine?.EngineVersion
              })
            }
            return result
          }, [] as NodeDetails[])
        )
      })
  }
    , [props])

  return (
    <MaterialTable id="nodes"
      columns={nodeColumns}
      data={nodes}
      virtual={true}
    />
  )

}

export default Nodes;