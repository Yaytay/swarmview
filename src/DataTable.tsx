import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';


export interface DataTablePropsEntry {
  link: string
  value: string
}
interface DataTableProps {
  headers?: string[]
  rows: (string | number | DataTablePropsEntry)[][] | undefined
}
export function entry(link: string, value: string): DataTablePropsEntry {
  return { link: link, value: value }
}
function DataTable(props: DataTableProps) {

  return (
    <TableContainer>
      <Table size="small" aria-label="simple table">
        {props.headers && (
          <TableHead>
            <TableRow>
              {
                props.headers.map(h => {
                  return (
                    <TableCell key={h}>
                      {h}
                    </TableCell>
                  )
                })
              }
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {props.rows && props.rows.map((r, ir) => {
            return (
              <TableRow key={ir} sx={{ border: 0 }} >
                {
                  r.map((v, iv) => {
                    return (
                      <TableCell key={iv}>
                        {
                          (typeof v !== 'object')
                            ? (
                              <Typography>{v}</Typography>
                            )
                            : (
                              <Link to={v.link}>
                                <Typography>{v.value}</Typography>
                              </Link>
                            )
                        }
                      </TableCell>
                    )
                  })
                }
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>

  )
}

export default DataTable;