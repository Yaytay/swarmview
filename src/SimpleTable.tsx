import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';


export type SimpleTableValue = (string | number | undefined | null)

interface SimpleTableProps {
  id: string
  headers?: string[]
  rows: (SimpleTableValue)[][] | undefined
  sx?: SxProps<Theme>
  rowStyle?: (row: SimpleTableValue[]) => SxProps<Theme> | undefined
}

function SimpleTable(props: SimpleTableProps) {

  return (
    <TableContainer>
      <Table size="small" aria-label="simple table" sx={[...(Array.isArray(props.sx) ? props.sx : [props.sx])]}>
        {props.headers && (
          <TableHead>
            {
              (props.headers && props.rows && (props.rows.length > 1))
                ?
                <TableRow>
                  {
                    props.headers.map((h) => {
                      return (
                        <TableCell key={h}>
                          <Box sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%' }}>
                              {h}
                            </Box>
                          </Box>
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
                :
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
            }
          </TableHead>
        )}
        <TableBody>
          {props?.rows && props.rows
              .map((r, ir) => {
                const style : SxProps<Theme> = props.rowStyle && props.rowStyle(r) || { border: 0 }
                return (
                  <TableRow key={ir} sx={[...(Array.isArray(style) ? style : [style])]} >
                    {
                      r
                        .map((v, iv) => {
                          return (
                            <TableCell key={iv} sx={{ verticalAlign: 'top'}}>
                              <Typography>{v}</Typography>
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

export default SimpleTable;