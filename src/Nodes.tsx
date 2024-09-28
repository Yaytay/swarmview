import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import NodesTable, { createNodeDetails, NodeDetails } from './tables/NodesTable';
import { Dimensions } from './app-types';

interface NodesProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
  maxSize?: Dimensions
}
function Nodes(props: NodesProps) {

  const [nodeDetails, setNodeDetails] = useState<NodeDetails[]>([])

  useEffect(() => {
    props.setTitle('Nodes')
    Promise.all([
      props.docker.nodes()
    ]).then(value => {
      const nodes = value[0]

      setNodeDetails(
        nodes?.reduce((result, current) => {
          result.push(
            createNodeDetails(current)
          )
          return result;
        }, [] as NodeDetails[])
      )
    })
  }, [props])

  return (
    <NodesTable id="services" nodes={nodeDetails} border={true} maxSize={props.maxSize} />
  )


}

export default Nodes;

