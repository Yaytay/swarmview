import { Node, Edge, Network, NetworkEvents, Options } from "vis-network"
import 'vis-network/styles/vis-network.css'
import { SxProps, Theme } from '@mui/material/styles';
import Box from "@mui/system/Box";
import { useEffect, useRef } from "react";

export type GraphData = {
  nodes?: Node[]
  edges?: Edge[]
}
interface VisNetworkProps {
  options: Options
  data: GraphData
  events: Record<string, (params?: any) => void>
  sx?: SxProps<Theme>
}
function VisNetwork(props: VisNetworkProps) {

  const target = useRef(null)

  useEffect(() => {
    if (target.current) {
      console.log('Rendering', props.data, 'to', target.current)
      const net = new Network(target.current, props.data, props.options)

      if (props.events) {
        for (const k in props.events) {
          const event = k as NetworkEvents
          net.on(event, props.events[event])
        }
      }
    }
  })

  return (
    <Box ref={ target } sx={[...(Array.isArray(props.sx) ? props.sx : [props.sx])]} />
  )

}
export default VisNetwork
export type { Node, Edge } from "vis-network"