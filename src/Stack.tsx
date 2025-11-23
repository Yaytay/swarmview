import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import Section from './Section';
import { DockerApi } from './DockerApi';
import ServicesTable, { createServiceDetails, ServiceDetails } from './tables/ServicesTable';
import TasksTable, { createTaskDetails, processTaskDetailsSubRows, TaskDetails } from './tables/TasksTable';
import NetworksTable, { createNetworkDetails, NetworkDetails } from './tables/NetworksTable';
import { SetTitle } from './App';

interface StackUiProps {
  baseUrl: string
  setTitle: SetTitle
  docker: DockerApi
  refresh: Date
}
type StackUiParams = {
  id: string;
};
function StackUi(props: StackUiProps) {
  const { id } = useParams<StackUiParams>();

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[]>([])
  const [networkDetails, setNetworkDetails] = useState<NetworkDetails[]>([])
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])

  useEffect(() => {
    Promise.all([
      props.docker.services()
      , props.docker.networks()
      , props.docker.tasks()
      , props.docker.servicesById()
      , props.docker.nodesById()
      , props.docker.exposedPorts()
    ]).then(value => {
      const services = value[0]
      const networks = value[1]
      const tasks = value[2]
      const servicesById = value[3]
      const nodesById = value[4]
      const exposedPorts = value[5]

      const nowMs = Date.now()

      setServiceDetails(
        services?.reduce((result, current) => {
          const labels = current.Spec?.Labels
          if (labels && id === labels['com.docker.stack.namespace']) {
            result.push(
              createServiceDetails(current, exposedPorts)
            )
          }
          return result
        }, [] as ServiceDetails[])
      )
      setNetworkDetails(
        networks?.reduce((result, current) => {
          const labels = current.Labels
          if (labels && id === labels['com.docker.stack.namespace']) {
            result.push(
              createNetworkDetails(current)
            )
          }
          return result

        }, [] as NetworkDetails[])
      )
      setTaskDetails(
        processTaskDetailsSubRows(
          tasks.reduce((result, current) => {
            const labels = current.Spec?.ContainerSpec?.Labels
            if (labels && id === labels['com.docker.stack.namespace']) {
              result.push(
                createTaskDetails(current, servicesById, nodesById, exposedPorts, nowMs)
              )
            }
            return result
          }
            , [] as TaskDetails[])
        )
      )
    })
  }, [props, id])

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Section id="stack.services" heading="Services" xs={12}>
            <ServicesTable id="stack.services" services={serviceDetails} />
          </Section>
          <Section id="stack.networks" heading="Networks" xs={12}>
            <NetworksTable id="stack.networks.table" networks={networkDetails} />
          </Section>
          <Section id="stack.tasks" heading="Tasks" xs={12}>
            <TasksTable id="stack.tasks.table" tasks={taskDetails} />
          </Section>
        </Grid>
      </Box>
    </Box >
  )


}

export default StackUi;