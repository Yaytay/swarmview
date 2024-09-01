import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Node, Service, Task } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTable, { DataTablePropsEntry, DataTableValue } from './DataTable';
import NodeChecks from './NodeChecks';
import { DockerApi } from './DockerApi';


interface NodeProps {
  baseUrl: string
  setTitle: (title: string) => void
  docker: DockerApi
  refresh: Date
}
type NodeUiParams = {
  id: string;
};
function NodeUi(props: NodeProps) {

  const [node, setNode] = useState<Node | null>(null)
  const [tab, setTab] = useState(0)

  const { id } = useParams<NodeUiParams>();

  const [nodes, setNodes] = useState<Node[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map<string, Service>())
  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])
  const [nodeTasks, setNodeTasks] = useState<DataTableValue[][]>([])
  const [nodeTaskHeaders, setNodeTaskHeaders] = useState<string[]>([])

  useEffect(() => {
    props.docker.nodes()
      .then(j => {
        console.log('Nodes: ', j)
        const returnedNodes = j as Node[]
        setNodes(returnedNodes)
        const node = returnedNodes.find(node => { return node.ID === id })
        if (node) {
          setNode(node)
        }
      })

    props.docker.tasks()
      .then(j => {
        setTasks(j)
      })

    props.docker.services()
      .then(svcs => {
        const buildServices = new Map<string, Service>()
        svcs.forEach(svc => {
          if (svc.ID) {
            buildServices.set(svc.ID, svc)
          }
        })
        setServices(buildServices)
      })
  }
    , [props.refresh, id])

  useEffect(() => {
    props.setTitle('Node: ' + node?.Description?.Hostname || node?.ID || '')

    if (node?.Spec?.Labels) {
      setLabels(Object.entries(node.Spec.Labels))
    }

    if (node && tasks) {
      setNodeTaskHeaders(['ID', 'NAME', 'CREATED', 'IMAGE', 'DESIRED', 'CURRENT', 'MEMORY', 'ERROR', 'PORTS'])
      const buildStackTasks: DataTableValue[][] = []
      const nodeTasks = tasks.filter(tsk => tsk.NodeID === id)
      nodeTasks.sort((l, r) => {
        return (l.CreatedAt ?? '') > (r.CreatedAt ?? '') ? -1 : 1
      })
      nodeTasks.forEach((tsk) => {
        if (tsk.ID) {
          buildStackTasks.push(
            [
              { link: '/task/' + tsk.ID, value: tsk.ID }
              , { link: '/service/' + tsk.ServiceID, value: ((tsk.ServiceID && services.get(tsk.ServiceID)?.Spec?.Name) ?? tsk.ServiceID) + '.' + (tsk.Slot ? tsk.Slot : tsk.NodeID) }
              , tsk?.CreatedAt || ''
              , tsk?.Spec?.ContainerSpec?.Image?.replace(/@.*/, '')
              , tsk?.DesiredState
              , tsk?.Status?.State
              , tsk?.Status?.State === 'running' && tsk?.Spec?.Resources?.Limits?.MemoryBytes ? tsk?.Spec?.Resources?.Limits?.MemoryBytes / 1048576 : null
              , tsk?.Status?.Err
              , tsk?.Status?.PortStatus?.Ports?.map(portSpec => {
                return portSpec.PublishedPort + ':' + portSpec.TargetPort
              })
              ,
            ]
          )
        }
      })
      setNodeTasks(buildStackTasks)
    }

  }, [node, tasks, services, id, props])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!node) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%' }} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Details" />
            <Tab label="Checks" />
            <Tab label="Raw" />
          </Tabs>
        </Box>
        {
          tab === 0 &&
          <Box>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Section id="node.overview" heading="Overview" xs={6} >
                  <DataTable id="node.overview.table" kvTable={true} rows={
                    [
                      ['ID', node.ID || '']
                      , ['Created', node.CreatedAt || '']
                      , ['Role', node?.Spec?.Role || ' ']
                      , ['Availability', node?.Spec?.Availability || ' ']
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="node.description" heading="Description" xs={6} >
                  <DataTable id="node.description.table" kvTable={true} rows={
                    [
                      ['Engine', node?.Description?.Engine?.EngineVersion || ' ']
                      , ['Architecture', node?.Description?.Platform?.Architecture || ' ']
                      , ['OS', node?.Description?.Platform?.OS || ' ']
                      , ['Memory', node?.Description?.Resources?.MemoryBytes ? String(node?.Description.Resources?.MemoryBytes / 1048576) + ' MB' : null]
                      , ['CPUs', (node?.Description?.Resources?.NanoCPUs ? node?.Description?.Resources?.NanoCPUs / 1000000000 : null)]
                    ]
                  }>
                  </DataTable>
                </Section>
                <Section id="node.labels" heading="Labels" xs={6} >
                  <DataTable id="node.labels.table" headers={
                    [
                      'Label'
                      , 'Value'
                    ]
                  } rows={labels}
                  >
                  </DataTable>
                </Section>
                <Section id="node.plugins" heading="Plugins" xs={6} >
                  <DataTable id="node.plugins.table" headers={
                    [
                      'Type'
                      , 'Name'
                    ]
                  } rows={node?.Description?.Engine?.Plugins?.map(p => [p?.Type, p?.Name])}
                  >
                  </DataTable>
                </Section>

                {
                  nodeTasks &&
                  <Section id="node.tasks" heading="Tasks" xs={12}>
                    <DataTable id="node.tasks.table" headers={nodeTaskHeaders} rows={nodeTasks}>
                    </DataTable>
                  </Section>
                }

              </Grid>
            </Box>
          </Box>
        }
        {
          tab === 1 &&
          <Box>
            <NodeChecks node={node} tasks={tasks} nodes={nodes} />
          </Box>
        }
        {
          tab === 2 &&
          <Box>
            <JSONPretty data={node} />
          </Box>
        }
      </Box >
    )
  }

}

export default NodeUi;