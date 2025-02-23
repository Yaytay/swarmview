import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DockerApi } from "./DockerApi";
import { ChartData, metricName, PrometheusResults, transformData } from "./prometheus";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Paper } from "@mui/material";
import Section from "./Section";

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


interface PromChartProps {
  docker: DockerApi
  , promQuery: string
  , id: string
  , title: string
  , scale?: number
  , refLine?: number
  , yticksuffix?: string
}
function PromChart(props: PromChartProps) {

  const [promData, setPromData] = useState<PrometheusResults | undefined>()
  const [chartData, setChartData] = useState<ChartData[]>([])

  let activeDataset: string | undefined

  useEffect(() => {
    props.docker.prometheusQueryRange(
      props.promQuery
      , 60 * 60 * 24
    ).then(data => {
      console.log('Metrics: ', data)

      if (data?.data?.result) {
        const chartData = transformData(data?.data?.result, props.scale)
        console.log(chartData)
        setPromData(data)
        setChartData(chartData)
      } else {
        setPromData(undefined)
        setChartData([])
      }
    }).catch(reason => {
      console.log('Failed to get prometheus API endpoint')
      throw reason
    })
  }, [props])


  if (promData && chartData) {
    return (
      <Section id={props.id} heading={props.title} xs={12}>
        <ResponsiveContainer width="100%" height={600}>
          <AreaChart
            data={chartData}
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
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              name='Time'
              tickFormatter={(unixTime) => new Date(unixTime * 1000.0).toISOString().substring(11, 19)}
              minTickGap={50}
            />
            <YAxis
              // domain={[0, Math.ceil((node.Description?.Resources?.MemoryBytes || 1048576) / 1048576)]}
              tickCount={8}
              tickFormatter={(bytes) => bytes + (props.yticksuffix || '')}
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
            {props.refLine && (
              <ReferenceLine y={props.refLine} stroke="black" strokeWidth={4} label="Node Memory" />
            )}
            {promData.data.result.map((r, index) => (
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
    )
  } else {
    return (<></>)
  }
}

export default PromChart
