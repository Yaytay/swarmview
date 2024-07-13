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


interface NodeProps {
  baseUrl: string
  setTitle: (title: string) => void
}
type NodeUiParams = {
  id: string;
};
function NodeUi(props: NodeProps) {

  const [node, setNode] = useState<Node | null>(null)
  const [tab, setTab] = useState(0)

  const { id } = useParams<NodeUiParams>();

  const [tasks, setTasks] = useState<Task[]>([])
  const [services, setServices] = useState<Map<string, Service>>(new Map<string, Service>())
  const [labels, setLabels] = useState<(string | number | DataTablePropsEntry)[][]>([])
  const [nodeTasks, setNodeTasks] = useState<DataTableValue[][]>([])
  const [nodeTaskHeaders, setNodeTaskHeaders] = useState<string[]>([])

  useEffect(() => {
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
        console.log('Nodes: ', j)
        const nodes = j as Node[]
        const node = nodes.find(node => { return node.ID === id })
        if (node) {
          setNode(node)
        } 
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
        setTasks(j)
      })

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
        var buildServices = new Map<string, Service>()
        for (var svc in j) {
          buildServices.set(j[svc].ID, j[svc])
        }
        setServices(buildServices)
      })
  }
    , [props.baseUrl, id])

  useEffect(() => {
    props.setTitle('Node: ' + node?.Description?.Hostname || node?.ID || '')

    if (node?.Spec?.Labels) {
      setLabels(Object.entries(node.Spec.Labels))
    }

    if (node && tasks) {
      setNodeTaskHeaders(['ID', 'NAME', 'CREATED', 'IMAGE', 'DESIRED STATE', 'CURRENT STATE', 'ERROR', 'PORTS'])
      const buildStackTasks: DataTableValue[][] = []
      const nodeTasks = tasks.filter(tsk => tsk.NodeID === id)
      nodeTasks.sort((l,r) => {
        return (l.CreatedAt??'') > (r.CreatedAt??'') ? -1 : 1
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

  }, [node, tasks, services])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  if (!node) {
    return <></>
  } else {
    return (
      <Box sx={{ width: '100%'}} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Details" />
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
                  , ['Memory', (node?.Description?.Resources?.MemoryBytes ? String(node?.Description.Resources?.MemoryBytes / 1048576) + 'MB' : null)]
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
        <JSONPretty data={node} />
      </Box>
    }
      </Box >
    )
  }

}

export default NodeUi;