import { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';


export interface DataTablePropsEntry {
  link: string
  value: string
}
export type DataTableValue = (null | undefined | string | number | string[] | DataTablePropsEntry | DataTablePropsEntry[])

interface DataTableProps {
  id: string
  kvTable?: boolean
  headers?: string[]
  rows: (DataTableValue)[][] | undefined
  sx?: SxProps<Theme>;
}
export function entry(link: string, value: string): DataTablePropsEntry {
  return { link: link, value: value }
}

interface DataTableValueProps {
  value: DataTableValue
}
function DataTableValue(props: DataTableValueProps) {

  if (!props.value) {
    return (<></>)
  } else if (Array.isArray(props.value)) {
    return (<>{
      props.value.map((member, index) => {
        return (<DataTableValue key={String(index)} value={member}/>)
      })
    }</>)
  } else if (typeof props.value === 'object') {
    return (<Typography><Link to={props.value.link}>{props.value.value}</Link></Typography>)
  } else {
    return (<Typography>{props.value}</Typography>)
  }
}

function compareDataTableValues(v1: DataTableValue, v2: DataTableValue) : number {
  if (!v1) {
    return v2 ? -1 : 0
  } else if(!v2) {
    return 1;
  } else if (Array.isArray(v1)) {
    return String(v1).localeCompare(String(v2))
  } else if (Array.isArray(v2)) {
    return String(v1).localeCompare(String(v2))
  } else {
    const v1Str = (typeof v1 === 'object') ? v1.value : String(v1)
    const v2Str = (typeof v2 === 'object') ? v2.value : String(v2)
    return v1Str.localeCompare(v2Str)
  }
}

function DataTable(props: DataTableProps) {

  interface SortAndFilterConfig {
    sort: string | null
    filter: number | null
    filterValue: string | null
  }

  const [sortAndFilterConfig, setSortAndFilterConfig] = useState<SortAndFilterConfig>(() => {
    const storedValue = localStorage.getItem(props.id) 
    const storedObject = storedValue ? JSON.parse(storedValue) : {}
    return {sort: storedObject?.sort || null, filter: storedObject?.filter || null, filterValue: storedObject?.filterValue || null}
  })

  const [values, setValues] = useState(props.rows)

  useEffect(() => {
    // console.log("SAF (" + props.id + "):", sortAndFilterConfig)
    // console.log("Rows: ", props.rows)

    if (props.rows) {
      var src = [...props.rows]
      if (sortAndFilterConfig.filter !== null && sortAndFilterConfig.filterValue) {
        src = src.filter(row => 
          ! sortAndFilterConfig.filter
            || row[sortAndFilterConfig.filter] === sortAndFilterConfig.filterValue
        )
      }
      if (sortAndFilterConfig.sort) {
        var field = sortAndFilterConfig.sort
        var factor = 1 
        if (field[0] === '-') {
          field = field.substring(1)
          factor = -1
        }
        const index = props.headers?.findIndex((k) => {return k === field})
        if (index) {
          src.sort((a,b) => { return factor * compareDataTableValues(a[index], b[index]) })
        }
      } 
      // console.log('Result', src)
      if (src.length === 0) {
        if (sortAndFilterConfig.filter && sortAndFilterConfig.filterValue) {
          if (props.headers) {
            console.log('All values filtered out by ' + props?.headers[sortAndFilterConfig.filter] + ' == ' + sortAndFilterConfig.filterValue)
          } else {
            console.log('All values filtered out by column ' +sortAndFilterConfig.filter + ' == ' + sortAndFilterConfig.filterValue)
          }
        }
      }
      setValues(src)
    } else {
      setValues([])
    }
  }, [sortAndFilterConfig, props])

  function updateSort(newSort: string) {
    var newConfig = {...sortAndFilterConfig}
    if (newConfig.sort === newSort) {
      newConfig.sort = '-' + newSort;
    } else if (newConfig.sort === '-' + newSort) {
      newConfig.sort = null
    } else {
      newConfig.sort = newSort
    }
    localStorage.setItem(props.id, JSON.stringify(newConfig))
    setSortAndFilterConfig(newConfig)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [filterIndex, setFilterIndex] = useState<number>(-1)
  const [filterOptions, setFilterOptions] = useState<string[] | null>()
  const filterMenuOpen = Boolean(anchorEl)
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setFilterIndex(index)
    setFilterOptions(
      props.rows?.reduce<string[]>((result, row) => {
        if (typeof row[index] === 'string' || typeof row[index] === 'number') {
          const newValue = String(row[index])
          if (result.indexOf(newValue) < 0) {
            result.push(String(row[index]))
          }
        }
        return result
      }, []).sort()
    )
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };  
  function handleClearFilter() {
    var newConfig = {...sortAndFilterConfig}
    newConfig.filter = -1
    newConfig.filterValue = null
    localStorage.setItem(props.id, JSON.stringify(newConfig))
    setSortAndFilterConfig(newConfig)
    setAnchorEl(null);
  }
  function handleSelection(value: string) {
    var newConfig = {...sortAndFilterConfig}
    newConfig.filter = filterIndex
    newConfig.filterValue = value
    localStorage.setItem(props.id, JSON.stringify(newConfig))
    setSortAndFilterConfig(newConfig)
    setAnchorEl(null);
  }

  return (
    <TableContainer>
      <Menu open={filterMenuOpen} anchorEl={anchorEl} onClose={handleClose}>
        { filterOptions && (
          <MenuList dense  sx={{ paddingTop: 0, paddingBottom: 0 }} >
            <MenuItem onClick={() => handleClearFilter()}>
              <ListItemText>
              Clear Filter
              </ListItemText>
            </MenuItem>
            <Divider sx={{ marginTop: 0, marginBottom: 0 }} />
            {filterOptions.map(fo => {
              return (
              <MenuItem key={fo} onClick={() => handleSelection(fo)}>
              <ListItemText>{fo}</ListItemText>
              </MenuItem>
              )
            })}
          </MenuList>
        )}
      </Menu>
      <Table size="small" aria-label="simple table" sx={[ ...(Array.isArray(props.sx) ? props.sx : [props.sx]) ]}>
        {props.headers && (
          <TableHead>
            {
              (props.headers && props.rows && (props.rows.length > 1))
              ?
              <TableRow>
                {
                  props.headers.map((h, i) => {
                    return (
                      <TableCell key={h}>
                        <Box sx={{ display: 'flex' }}>
                        <Box sx={{ width: '100%' }} onClick={() => {updateSort(h)}}>
                          {h}
                          {sortAndFilterConfig.sort === h && <ArrowDropUpIcon fontSize='inherit'/>}
                          {sortAndFilterConfig.sort === '-' + h && <ArrowDropDownIcon fontSize='inherit'/>}
                        </Box>
                        <Box onClick={(evt) => {handleFilterClick(evt, i)}}>
                          <FilterListIcon fontSize='inherit'/>
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
          {values && 
            values
              .filter(row => !props.kvTable|| row[1])
              .map((r, ir) => {
            return (
              <TableRow key={ir} sx={{ border: 0 }} >
                {
                  r
                    .map((v, iv) => {
                    return (
                      <TableCell key={iv} sx={{ verticalAlign: 'top' }}>
                        <DataTableValue value={v} />
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