import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Box from '@mui/material/Box';
import { Node, Task } from './docker-schema';
import Section from './Section'
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NodeChecks from './NodeChecks';
import { DockerApi } from './DockerApi';
import KeyValueTable from './KeyValueTable';
import LabelsTable, { createLabelDetails, LabelDetails } from './tables/LabelsTable';
import TasksTable, { createTaskDetails, processTaskDetailsSubRows, TaskDetails } from './tables/TasksTable';
import PluginsTable, { createPluginDetails, PluginDetails } from './tables/PluginsTable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartData, metricName, PrometheusResults, transformData } from './prometheus';
import { Paper } from '@mui/material';



const colours = [
  "#FF9999", "#FFCC99", "#FFFF99", "#99FF99", "#99CCFF",
  "#FF6666", "#FF9966", "#FFFF66", "#66FF66", "#66CCFF",
  "#FF99CC", "#FFCC99", "#FFFF99", "#99FF66", "#99CCFF",
  "#FF99FF", "#FFCC99", "#FFFF99", "#99FF66", "#99CCFF",
  "#FF66CC", "#FF9966", "#FFFF66", "#66FF66", "#66CCFF",
  "#FF66FF", "#FF9966", "#FFFF66", "#66FF66", "#66CCFF",
  "#FF9999", "#FFCC99", "#FFFF99", "#99FF99", "#99CCFF",
  "#FF6666", "#FF9966", "#FFFF66", "#66FF66", "#66CCFF",
  "#FF99CC", "#FFCC99", "#FFFF99", "#99FF66", "#99CCFF",
  "#FF99FF", "#FFCC99", "#FFFF99", "#99FF66", "#99CCFF"
]

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

  const [node, setNode] = useState<Node | undefined>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [nodes, setNodes] = useState<Node[]>([])
  const [tab, setTab] = useState(0)
  
  const [memoryData, setMemoryData] = useState<PrometheusResults | undefined>()
  const [memoryChartData, setMemoryChartData] = useState<ChartData[]>([])

  const { id } = useParams<NodeUiParams>();

  const [labelDetails, setLabelDetails] = useState<LabelDetails[]>([])
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>([])
  const [PluginDetails, setPluginDetails] = useState<PluginDetails[]>([])

  // const [activeDataset, setActiveDataset] = useState<string | undefined>()
  let activeDataset : string | undefined

  useEffect(() => {
    Promise.all([
      props.docker.nodes()
      , props.docker.tasks()
      , props.docker.servicesById()
      , props.docker.exposedPorts()
    ]).then(value => {
      const nodes = value[0]
      const tasks = value[1]
      const servicesById = value[2]
      const exposedPorts = value[3]

      setNodes(nodes)
      setTasks(tasks)

      // This repeition of docker.nodesById() avoids a race condition where that hits the network twice
      const nodesById = nodes.reduce((result, current) => {
        if (current.ID) {
          result.set(current.ID, current)
        }
        return result
      }, new Map<string, Node>())


      const node = nodes.find(nod => { return nod.ID === id })
      setNode(node)
      props.setTitle('Node: ' + (node?.Description?.Hostname || node?.ID))

      const nowMs = Date.now()

      setTaskDetails(
        processTaskDetailsSubRows(
          tasks.reduce((result, current) => {
            if (current.NodeID === id) {
              result.push(createTaskDetails(current, servicesById, nodesById, exposedPorts, nowMs))
            }
            return result
          }, [] as TaskDetails[])
        )
      )

      if (node?.Spec?.Labels) {
        const record = node?.Spec?.Labels
        setLabelDetails(Object.keys(record).reduce((result, current) => {
          result.push(createLabelDetails(current, record[current]))
          return result
        }, [] as LabelDetails[]))
      } else {
        setLabelDetails([])
      }

      if (node?.Description?.Engine?.Plugins) {
        setPluginDetails(node.Description.Engine.Plugins.reduce((result, current) => {
          if (current.Type || current.Name) {
            result.push(createPluginDetails(current.Type || '', current.Name || ''))
          }
          return result
        }, [] as PluginDetails[]))
      } else {
        setPluginDetails([])
      }
    })

    props.docker.prometheusQueryRange(
      'ctr_memory_usage{ctr_nodeid="' + id + '",job="swarm_service"}'
      , 60 * 60 * 24
    ).then(data => {
        console.log('Metrics: ', data)

        if (data?.data?.result) {
          const chartData = transformData(data?.data?.result, 1024*1024)
          console.log(chartData)
          setMemoryData(data)
          setMemoryChartData(chartData)
        } else {
          setMemoryData(undefined)
          setMemoryChartData([])
        }
      })
      .catch(reason => {
        console.log('Failed to get prometheus API endpoint')
        throw reason
      })
  }
    , [props, id])


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
            <Grid container spacing={2} sx={{paddingBottom: '10px'}}>
              <Section id="node.overview" heading="Overview" xs={6} >
                <KeyValueTable id="node.overview.table" kvTable={true} rows={
                  [
                    ['ID', node.ID || '']
                    , ['Created', node.CreatedAt || '']
                    , ['Role', node?.Spec?.Role || ' ']
                    , ['Availability', node?.Spec?.Availability || ' ']
                  ]
                }>
                </KeyValueTable>
              </Section>
              <Section id="node.description" heading="Description" xs={6} >
                <KeyValueTable id="node.description.table" kvTable={true} rows={
                  [
                    ['Engine', node?.Description?.Engine?.EngineVersion || ' ']
                    , ['Architecture', node?.Description?.Platform?.Architecture || ' ']
                    , ['OS', node?.Description?.Platform?.OS || ' ']
                    , ['Memory', node?.Description?.Resources?.MemoryBytes ? String(node?.Description.Resources?.MemoryBytes / 1048576) + ' MB' : null]
                    , ['CPUs', (node?.Description?.Resources?.NanoCPUs ? node?.Description?.Resources?.NanoCPUs / 1000000000 : null)]
                  ]
                }>
                </KeyValueTable>
              </Section>
              <Section id="node.labels" heading="Labels" xs={6} >
                <LabelsTable id="node.labels.table" labels={labelDetails} />
              </Section>
              <Section id="node.plugins" heading="Plugins" xs={6} >
                <PluginsTable id="node.plugins.table" plugins={PluginDetails} />
              </Section>
              <Section id="node.tasks" heading="Tasks" xs={12}>
                <TasksTable id="node.tasks.table" tasks={taskDetails} />
              </Section>
              {
                memoryChartData && memoryData?.data.result &&
                <Section id="node.memory" heading="Memory Usage" xs={12}>
                  <ResponsiveContainer width="100%" height={600}>
                    <AreaChart
                      data={memoryChartData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                      onMouseMove={(_, native) => {
                        const value = native?.target?.attributes?.getNamedItem('name')?.value
                        if (value && value !== activeDataset) {
                          activeDataset = value
                          // setActiveDataset(value)
                        }
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        name = 'Time'
                        tickFormatter = {(unixTime) => new Date(unixTime * 1000.0).toISOString().substring(11,19)}
                        minTickGap={50}
                        />
                      <YAxis 
                        // domain={[0, Math.ceil((node.Description?.Resources?.MemoryBytes || 1048576) / 1048576)]}
                        tickCount={8}
                        tickFormatter = {(bytes) => bytes + ' MB'}
                        width={100}
                        />
                      <Tooltip
                        content={(x) => {
                          if (x?.label) {
                            return (
                              <Box sx={{ padding: '10px' }}>
                                <Paper>
                                  {new Date(x.label * 1000).toISOString()}
                                  <br />
                                  {activeDataset}
                                  <br />
                                  {x.payload?.filter(p => p.name === activeDataset).map(v => v.value)}
                                </Paper>
                              </Box>
                            )
                          } else {
                            return (<></>)
                          }
                        }}
                      />
                      <ReferenceLine y={(node.Description?.Resources?.MemoryBytes || 0) / 1048576} stroke="black" strokeWidth={4} label="Node Memory" />
                      {memoryData.data.result.map((r, index) => (
                          <Area type="monotone" 
                              key={index}
                              name={metricName(r)} 
                              dataKey={metricName(r)} 
                              stackId="1" 
                              stroke={colours[index % colours.length]} 
                              fill={colours[index % colours.length]} 
                              />
                        ))}
                    </AreaChart>
                  </ResponsiveContainer>
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