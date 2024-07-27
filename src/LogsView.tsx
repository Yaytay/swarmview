import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso'

interface LogsViewProps {
  url: string
  tail?: number
  follow?: boolean
  filter?: string
}

interface LogRow {
  index: number
  stream: string
  message: string
}

interface LogData {
  rows: LogRow[]
}

const logData: LogData = { rows: [] }
let currentIndex = 0
let mounted = false

let prevProps : LogsViewProps = {url: '', tail: 0, follow: false, filter: '.*'}

console.log('Running')

function onlyDifferByFollow(a : LogsViewProps, b : LogsViewProps) {
  return (a.url === b.url && a.tail === b.tail && a.filter === b.filter)
}

function LogsView(props: LogsViewProps) {
  
  useEffect(() => {
    console.log('Rendering starting with ' + logData.rows.length + ' messages')
    if (!mounted) {
      console.log('Mounting')

      if (reader) {
        reader.cancel()
        reader = undefined
      }
      if (onlyDifferByFollow(prevProps, props) && !props.follow) {
        prevProps = { ...props }
      } else {
        prevProps = { ...props }
        setLogCount(0)
        logData.rows.length = 0
        mounted = true
        startProcessing()
      }
    }
    return () => {
      console.log('Unmounted with ', logData.rows.length)
      mounted = false
    }
  }, [props])

  const [logCount, setLogCount] = useState<number>(0)

  function parseRegex(arg : string) : RegExp | null {
    try {
      return new RegExp(arg)
    } catch(ex) {
      console.log('The string "' + arg + '" could not be parsed as a regex: ', ex)
      return null
    }
  }

  const filterRegex = props.filter && parseRegex(props.filter)

  const textDecoder = new TextDecoder()

  let reader : ReadableStreamDefaultReader<Uint8Array> | undefined = undefined

  function startProcessing() {
    let prevData: Uint8Array | null = null

    function processChunk(chunk: Uint8Array) {
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
            if (!filterRegex || (filterRegex && message.match(filterRegex))) {
              logData.rows.push({ index: ++currentIndex, stream: stream, message: message })
            }
          }
        }
      }
    }

    const url = props.url + '?stdout=true&stderr=true&tail=' + (props.tail || 1000) + '&follow=' + (props.follow || 'false')
    console.log('Starting log fetch of', url)
    if (!reader) {
      fetch(url)
        .then(r => {

          if (r.status != 200) {
            return r.text().then(body => {
              throw 'Failed to get logs (status code was ' + r.status + '): ' + body
            })
          }

          if (!reader) {
            reader = r.body?.getReader()
            if (!reader) {
              throw 'No reader returned (status code was ' + r.status + ')'
            } else {
              function pump(arg: ReadableStreamReadResult<Uint8Array>): Promise<void> | undefined {
                if (mounted) {
                  if (arg.value) {
                    processChunk(arg.value)
                    setLogCount(currentIndex)
                    // console.log(currentIndex, logData.rows[logData.rows.length - 1])
                  }
                } else {                  
                  reader?.cancel()
                  reader = undefined
                }
                if (arg.done) {
                  console.log('Log read done')
                  reader = undefined
                } else {
                  return reader?.read().then(pump);
                }
              }
              if (reader) {
                reader.read().then(pump)
              }
            }
          }
        })
        .catch(ex => {
          console.log('Failed to read logs from ' + props.url, ex)
        })
    }
  }

  return (
    <Virtuoso
      context={ logCount }
      style={{ height: '100%' }}
      totalCount={logData.rows.length}
      itemContent={index => {
        if (logData.rows.length > index) {
          return <div className='logRow'>{logData.rows[index].message}</div>}
        }
      }
    />
  )

}

export default LogsView