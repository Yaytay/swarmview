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
export type DataTableValue = (null | undefined | string | number | string[] | DataTablePropsEntry)

interface DataTableProps {
  id: string
  headers?: string[]
  rows: (DataTableValue)[][] | undefined
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
        return (<Box key={String(index)}><DataTableValue value={member}/><br/></Box>)
      })
    }</>)
  } else if (typeof props.value === 'object') {
    return (<Link to={props.value.link}>{props.value.value}</Link>)
  } else {
    return (<>{props.value}</>)
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
    return {sort: storedObject?.sort, filter: storedObject?.filter, filterValue: storedObject?.filterValue}
  })

  const [values, setValues] = useState(props.rows)

  useEffect(() => {
    console.log("SAF (" + props.id + "):", sortAndFilterConfig)

    if (props.rows) {
      var src = [...props.rows]
      if (sortAndFilterConfig.filter !== null && sortAndFilterConfig.filterValue) {
        src = src.filter(row => 
          sortAndFilterConfig.filter === null 
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
      setValues(src)
    } else {
      setValues([])
    }
  }, [sortAndFilterConfig])

  function updateSort(newSort: string) {
    var newConfig = {...sortAndFilterConfig}
    if (newConfig.sort === newSort) {
      newConfig.sort = '-' + newSort;
    } else if (newConfig.sort === '-' + newSort) {
      newConfig.sort = null
    } else {
      newConfig.sort = newSort
    }
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
    setSortAndFilterConfig(newConfig)
    setAnchorEl(null);
  }
  function handleSelection(value: string) {
    var newConfig = {...sortAndFilterConfig}
    newConfig.filter = filterIndex
    newConfig.filterValue = value
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
              <MenuItem onClick={() => handleSelection(fo)}>
              <ListItemText>{fo}</ListItemText>
              </MenuItem>
              )
            })}
          </MenuList>
        )}
      </Menu>
      <Table size="small" aria-label="simple table">
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
          {values && values.map((r, ir) => {
            return (
              <TableRow key={ir} sx={{ border: 0 }} >
                {
                  r.map((v, iv) => {
                    return (
                      <TableCell key={iv}>
                        <Typography>
                          <DataTableValue value={v} />
                        </Typography>
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