import { useState, useEffect } from 'react';
import { DockerApi } from './DockerApi';
import { Dimensions } from './app-types';
import { SetTitle } from './App';
import NodesTable, { createNodeDetails, NodeDetails } from './tables/NodesTable';
import { Box, Grid } from '@mui/system';
import Section from './Section';
import StacksOverviewTable from './tables/StacksOverviewTable';

interface OverviewProps {
  baseUrl: string
  setTitle: SetTitle
  docker: DockerApi
  refresh: Date
  maxSize: Dimensions
}
function Overview(props: OverviewProps) {

  const [nodeDetails, setNodeDetails] = useState<NodeDetails[]>([])

  useEffect(() => {
    props.setTitle('Overview')
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
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{paddingBottom: '10px'}}>
          <Section id="node.overview" heading="Nodes" xs={12} >
            <NodesTable id="services" nodes={nodeDetails} border={true} maxSize={props.maxSize} />
          </Section>
          <Section id="stack.overview" heading="Stacks" xs={12} >
            <StacksOverviewTable id="stacks" docker={props.docker} />
          </Section>
        </Grid>
      </Box>
    </Box>
  )

}

export default Overview;