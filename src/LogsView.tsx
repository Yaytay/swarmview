import Checkbox from "@mui/material/Checkbox"
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Box from "@mui/system/Box"
import LogsContent from "./LogsContent"
import { useState } from "react"

interface LogsViewProps {
  id: string
  logsUrl: string
}

interface Config {
  tail?: number
  follow?: boolean
  filter?: string
}

function LogsView(props: LogsViewProps) {

  const lastConfig : Config = JSON.parse(localStorage.getItem(props.id + '.config') || '{}')

  const [logsTail, setLogsTail] = useState<number>(lastConfig.tail || 50)
  const [logsFollow, setLogsFollow] = useState<boolean>(lastConfig.follow || false)
  const [logsFilterEdit, setLogsFilterEdit] = useState<string>(lastConfig.filter || '')
  const [logsFilter, setLogsFilter] = useState<string>(lastConfig.filter || '')

  function storeConfig(tail : number | undefined, follow : boolean | undefined, filter: string | undefined) {
    const config : Config = {
      tail: tail
      , follow: follow
      , filter: filter
    }
    localStorage.setItem(props.id + '.config', JSON.stringify(config))
  }

  function setTail(tail: number) {
    setLogsTail(tail)
    storeConfig(tail, logsFollow, logsFilter)
  }

  function setFollow(follow: boolean) {
    setLogsFollow(follow)
    storeConfig(logsTail, follow, logsFilter)
  }

  function setFilter(filter: string) {
    setLogsFilter(filter)
    storeConfig(logsTail, logsFollow, filter)
  }

  return <Grid sx={{ height: '90%', flex: '1 1 auto', display: 'flex' }}>
    <Paper sx={{ flexGrow: 1, display: 'flex', flexFlow: 'column' }}>
      <Box sx={{ display: 'flex', flexFlow: 'row' }}>
        <InputLabel htmlFor="logsTailInput" sx={{ padding: '8px' }} >Tail: </InputLabel>
        <Select id="logsTailInput" value={logsTail} onChange={e => setTail(Number(e.target.value))} size="small" sx={{ paddingTop: '0px', paddingBottom: '0px' }}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
          <MenuItem value={5000}>5000</MenuItem>
        </Select>
        <InputLabel htmlFor="logsFollowInput" sx={{ padding: '8px' }} >Follow: </InputLabel>
        <Checkbox id="logsFollowInput" checked={logsFollow} onChange={e => { setFollow(!logsFollow) }} />
        <InputLabel htmlFor="logsFilterInput" sx={{ padding: '8px' }} >Filter: </InputLabel>
        <TextField id="logsFilterInput" variant="outlined" value={logsFilterEdit} sx={{ paddingTop: '0px', paddingBottom: '0px' }} size="small" onChange={e => setLogsFilterEdit(e.target.value)} onBlur={e => setFilter(e.target.value)} />
      </Box>
      <LogsContent url={props.logsUrl} tail={logsTail} follow={logsFollow} filter={logsFilter} />
    </Paper>
  </Grid>

}

export default LogsView