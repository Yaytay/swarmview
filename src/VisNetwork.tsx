import { Data, Network, NetworkEvents, Options } from "vis-network"
import 'vis-network/styles/vis-network.css'
import { SxProps, Theme } from '@mui/material/styles';
import Box from "@mui/system/Box";
import { useEffect, useRef } from "react";

interface VisNetworkProps {
  options: Options
  data: Data
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