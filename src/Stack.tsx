import { useState, useEffect } from 'react';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Network, Service, Task, Node } from './docker-schema';
import { useParams } from 'react-router-dom';
import Section from './Section';

interface StackUiProps {
  baseUrl: string
  setTitle: (title: string) => void
}
type StackUiParams = {
  id: string;
};
function StackUi(props: StackUiProps) {
  const { id } = useParams<StackUiParams>();

  const [services, setServices] = useState<Map<string, Service>>(new Map())
  const [networks, setNetworks] = useState<Map<string, Network>>(new Map())
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map())
  const [tasks, setTasks] = useState<Map<string, Map<string, Task[]>>>(new Map())

  const [stackTasks, setStackTasks] = useState<DataTableValue[][]>([])
  const [stackTaskHeaders, setStackTaskHeaders] = useState<string[]>([])
  const [stackNetworks, setStackNetworks] = useState<DataTableValue[][]>([])
  const [stackNetworkHeaders, setStackNetworkHeaders] = useState<string[]>([])

  useEffect(() => {
    fetch(props.baseUrl + 'services')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get services:', reason)
      })
      .then(j => {
        const baseServices = j as Service[]
        const buildServices = new Map<string, Service>()
        baseServices.forEach(svc => {
          if (svc.ID) {
            buildServices.set(svc.ID, svc)
          }
        })
        setServices(buildServices)
      })

    fetch(props.baseUrl + 'networks')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get networks:', reason)
      })
      .then(j => {
        const baseNetworks = j as Network[]
        const buildNetworks = new Map<string, Network>()
        baseNetworks.forEach(net => {
          if (net.Id) {
            buildNetworks.set(net.Id, net)
          }
        })
        setNetworks(buildNetworks)
      })

    fetch(props.baseUrl + 'nodes')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get nodes:', reason)
      })
      .then(j => {
        const baseNodes = j as Node[]
        const buildNodes = new Map<string, Node>()
        baseNodes.forEach(nod => {
          if (nod.ID) {
            buildNodes.set(nod.ID, nod)
          }
        })
        setNodes(buildNodes)
      })


    fetch(props.baseUrl + 'tasks')
      .then(r => {
        if (r.ok) {
          return r.json();
        }
      })
      .catch(reason => {
        console.log('Failed to get tasks:', reason)
      })
      .then(j => {
        props.setTitle('Stack: ' + id)
        const baseTasks = j as Task[]
        // Collate all tasks by stack and then by service
        const buildTasks = new Map<string, Map<string, Task[]>>()
        baseTasks.forEach(tsk => {
          const labels = tsk.Spec?.ContainerSpec?.Labels
          if (labels) {
            const namespace = labels['com.docker.stack.namespace']
            if (namespace) {
              var currentTaskServices = buildTasks.get(namespace)
              if (!currentTaskServices) {
                currentTaskServices = new Map<string, Task[]>()
                buildTasks.set(namespace, currentTaskServices)
              }
              const serviceId = tsk.ServiceID
              const slotId = tsk.Slot
              const nodeId = tsk.NodeID
              const jobId = serviceId + '.' + (slotId ? slotId : nodeId)
              if (serviceId) {
                var currentTaskJobs = currentTaskServices.get(jobId)
                if (!currentTaskJobs) {
                  currentTaskJobs = []
                  currentTaskServices.set(jobId, currentTaskJobs)
                }
                currentTaskJobs.push(tsk)
              }
            }
          }
        })
        console.log(buildTasks)
        setTasks(buildTasks)
      })
  }
    , [props.baseUrl])

  useEffect(() => {
    if (tasks && networks && nodes && services) {
      if (id) {
        setStackTaskHeaders(['ID', 'NAME', 'IMAGE', 'NODE', 'DESIRED STATE', 'CURRENT STATE', 'ERROR', 'PORTS'])
        const buildStackTasks: DataTableValue[][] = []
        const currentTaskServices = tasks.get(id)
        currentTaskServices?.forEach((svcTasks, _) => {
          svcTasks.sort((l, r) => {
            return (l.CreatedAt ?? '') > (r.CreatedAt ?? '') ? -1 : 1
          })
          svcTasks.forEach((tsk, idx) => {
            if (tsk.ID) {
              buildStackTasks.push(
                [
                  { link: '/task/' + tsk.ID, value: tsk.ID }
                  , { link: '/service/' + tsk.ServiceID, value: ((tsk.ServiceID && services.get(tsk.ServiceID)?.Spec?.Name) ?? tsk.ServiceID) + '.' + (tsk.Slot ? tsk.Slot : tsk.NodeID), sx: { paddingLeft: (idx > 0 ? '1em' : 'inherited') } }
                  , tsk?.Spec?.ContainerSpec?.Image?.replace(/@.*/, '')
                  , { link: '/node/' + tsk.NodeID, value: ((tsk?.NodeID && nodes.get(tsk?.NodeID)?.Description?.Hostname) ?? tsk?.NodeID) || ''}
                  , tsk?.DesiredState
                  , tsk?.Status?.State
                  , tsk?.Status?.Err
                  , tsk?.Status?.PortStatus?.Ports?.map(portSpec => {
                    return portSpec.PublishedPort + ':' + portSpec.TargetPort
                  })
                ]
              )
            }
          })
        })
        setStackTasks(buildStackTasks)

        setStackNetworkHeaders(['ID', 'NAME', 'OPTIONS', 'SERVICES'])
        const buildStackNetworks: DataTableValue[][] = []

        networks.forEach(net => {
          const labels = net.Labels
          if (labels) {
            const namespace = labels['com.docker.stack.namespace']
            if (namespace == id) {
              const svcs: DataTablePropsEntry[] = []

              services.forEach(svc => {
                if (svc?.Spec?.TaskTemplate?.Networks?.find(n => { return n.Target === net?.Id })) {
                  if (svc?.Spec?.Name && (!svcs.find(s => { return (s.value === svc?.Spec?.Name) }))) {
                    svcs.push({ link: '/service/' + svc.ID, value: svc?.Spec?.Name })
                  }
                }
              })

              console.log(svcs)

              buildStackNetworks.push(
                [
                  net.Id && { link: '/network/' + net.Id, value: net.Id }
                  , net.Name
                  , JSON.stringify(net?.Options)
                  , svcs
                ]
              )
            }
          }
        })
        setStackNetworks(buildStackNetworks)
      } else {
        console.log('id not set')
      }
    }
  }, [id, tasks, networks, nodes, services])

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {
            stackTasks &&
            <Section id="stack.tasks" heading="Tasks" xs={12}>
              <DataTable id="stack.tasks.table" headers={stackTaskHeaders} rows={stackTasks}>
              </DataTable>
            </Section>
          }
          {
            stackNetworks &&
            <Section id="stack.networks" heading="Networks" xs={12}>
              <DataTable id="stack.networks.table" headers={stackNetworkHeaders} rows={stackNetworks}>
              </DataTable>
            </Section>
          }
        </Grid>
      </Box>
    </Box >
  )


}

export default StackUi;