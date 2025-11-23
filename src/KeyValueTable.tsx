import { ReactNode } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';


export interface KeyValueTablePropsEntry {
  link?: string
  value: string
  sx?: SxProps<Theme>
  children?: ReactNode
}
export type KeyValueTableValue = (null | undefined | string | number | string[] | KeyValueTablePropsEntry | KeyValueTablePropsEntry[])

interface KeyValueTableProps {
  id: string
  kvTable?: boolean
  rows: (KeyValueTableValue)[][]
  sx?: SxProps<Theme>
  rowStyle?: (_: KeyValueTableValue[]) => SxProps<Theme> | undefined
}

interface KeyValueTableValueProps {
  value: KeyValueTableValue
}
function KeyValueTableValueComp(props: KeyValueTableValueProps) {
  if (!props.value) {
    return (<></>)
  } else if (Array.isArray(props.value)) {
    return (<>{
      props.value.map((member, index) => {
        return (<KeyValueTableValueComp key={String(index)} value={member} />)
      })
    }</>)
  } else if (typeof props.value === 'object') {
    if (props.value.children) {
      return (<>{props.value.children}</>)
    } else if (props.value.link) {
        return (<Typography sx={[...(Array.isArray(props.value.sx) ? props.value.sx : [props.value.sx])]}><Link to={props.value.link}>{props.value.value}</Link></Typography>)
    } else {
      return (<Typography sx={[...(Array.isArray(props.value.sx) ? props.value.sx : [props.value.sx])]}>{props.value.value}</Typography>)
    }
  } else {
    return (<Typography>{props.value}</Typography>)
  }
}

function KeyValueTable(props: KeyValueTableProps) {

  return (
    <TableContainer>
      <Table size="small" aria-label="simple table" sx={[...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
        <TableBody>
          {props.rows
              .map((r, ir) => {
                const style : SxProps<Theme> = props.rowStyle && props.rowStyle(r) || { border: 0 }
                return (
                  <TableRow key={ir} sx={[...(Array.isArray(style) ? style : [style])]} >
                    <TableCell key={ir + '_0'} sx={{ verticalAlign: 'top'}}>
                      <KeyValueTableValueComp value={r[0]} />
                    </TableCell>
                    <TableCell key={ir + '_1'} sx={{ verticalAlign: 'top'}}>
                      <KeyValueTableValueComp value={r[1]} />
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>
    </TableContainer>

  )
}

export default KeyValueTable;