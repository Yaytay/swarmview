import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';


interface LogsViewProps {
  url: string
}

interface LogRow {
  index: number
  stream: string
  message: string
}

let currentIndex = 0
function LogsView(props: LogsViewProps) {

  const [data, setData] = useState<LogRow[]>([])

  let mounted = false

  useEffect(() => {
    mounted = true
    return () => {
      mounted = false
    }
  }, [])

  const textDecoder = new TextDecoder()

  let prevData : Uint8Array | null = null

  function processChunk(buildData : LogRow[], chunk: Uint8Array) {
    if (prevData) {
      chunk = Uint8Array.from([...prevData, ...chunk])
      prevData = null
    }

    while (chunk.length > 0) {
      if (chunk.length < 8) {
        prevData = chunk
        chunk = Uint8Array.from([])
      } else {
        const dataview = new DataView(chunk.buffer)
        const stream = chunk[0] == 0 ? 'stdin' : (chunk[0] == 1 ? 'stdout' : (chunk[0] == 2 ? 'stderr' : 'err: ' + chunk[0]))
        const size = dataview.getUint32(4, false)
        if (chunk.length < 8 + size) {
          prevData = chunk
          chunk = Uint8Array.from([])
        } else {
          const message = textDecoder.decode(chunk.slice(8, 8 + size))
          chunk = chunk.slice(8 + size)
          buildData.push({ index: ++currentIndex, stream: stream, message: message })
          if (buildData.length > 111) {
            buildData.splice(0,1)
          }
          // console.log(buildData.length, currentIndex, message, buildData[0].message)
        }
      }
    }
  }

  useEffect(() => {
    setData([])
    const buildData : LogRow[] = []
    fetch(props.url + '?stdout=true&stderr=true&follow=true')
      .then(r => {

        if (r.status != 200) {
          return r.text().then(body => {
            throw 'Failed to get logs (status code was ' + r.status + '): ' + body
          })
        }

        const reader = r.body?.getReader()
        if (!reader) {
          throw 'No reader returned (status code was ' + r.status + ')'
        } else {
          function pump(arg: ReadableStreamReadResult<Uint8Array>): Promise<void> | undefined {
            if (mounted) {
              if (arg.value) {
                processChunk(buildData, arg.value)
                console.log('Setting data to ' + buildData.length)
                setData(buildData.slice())
              }
            } else {
              reader?.cancel()
            }
            if (arg.done) {
              console.log('Log read done')
            } else {
              return reader?.read().then(pump);
            }
          }
          reader.read().then(pump)
        }
      })
      .catch(ex => {
        console.log('Failed to read logs from ' + props.url, ex)
      })
    }, [props.url])

  return (
    <TableContainer>
      <Table size="small" aria-label="simple table" >
        <TableBody>
          {
            data.map(r => {
              return <TableRow key={r.index}>
                <TableCell>
                  {r.index}
                </TableCell>
                <TableCell>
                  {r.stream}
                </TableCell>
                <TableCell>
                  {r.message}
                </TableCell>
              </TableRow>
            })
          }
        </TableBody>
      </Table>
    </TableContainer>

  )

}

export default LogsView