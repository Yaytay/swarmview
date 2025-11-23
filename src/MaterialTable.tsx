import { Box, IconButton, PaperProps, TableContainerProps, TableRowProps, Tooltip, useTheme } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_ColumnFiltersState, MRT_ColumnOrderState, MRT_ColumnSizingState, MRT_DensityState, MRT_Row, MRT_RowData, MRT_ShowHideColumnsButton, MRT_SortingState, MRT_TableInstance, MRT_ToggleDensePaddingButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, MRT_VisibilityState, useMaterialReactTable } from "material-react-table"
import { useEffect, useRef, useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export interface MaterialTableState {
  columnFilters: MRT_ColumnFiltersState
  columnOrder: MRT_ColumnOrderState
  columnVisibility: MRT_VisibilityState
  columnSizing: MRT_ColumnSizingState
  density: MRT_DensityState
  globalFilter?: string
  showGlobalFilter: boolean
  showColumnFilters: boolean
  sorting: MRT_SortingState
}

interface MaterialTableProps<Type extends MRT_RowData> {
  id: string
  columns: MRT_ColumnDef<Type>[]
  data: Type[]
  defaultState?: MaterialTableState
  virtual?: boolean
  border?: boolean
  subrows?: boolean
  muiTableContainerProps?: TableContainerProps
  muiTablePaperProps?: PaperProps
  muiTableBodyRowProps?: ((_: {
    isDetailPanel?: boolean;
    row: MRT_Row<Type>;
    staticRowIndex: number;
    table: MRT_TableInstance<Type>;
  }) => TableRowProps) | TableRowProps
}

function loadState(id: string): MaterialTableState | undefined {
  const tableState = localStorage.getItem(id + '.state')

  if (tableState) {
    return JSON.parse(tableState);
  }
}

function MaterialTable<Type extends MRT_RowData>(props: MaterialTableProps<Type>) {

  const globalTheme = useTheme();

  const isFirstRender = useRef(true);

  const defaultState = props.defaultState || {
    columnFilters: []
    , columnOrder: props.columns.map((c) => c.accessorKey as string)
    , columnVisibility: {}
    , columnSizing: {}
    , density: 'compact'
    , showColumnFilters: false
    , showGlobalFilter: false
    , sorting: []
  }
  const [state, setState] = useState<MaterialTableState>(loadState(props.id) || defaultState)

  function copy(table: MRT_TableInstance<Type>) {
    const header = table.getVisibleLeafColumns().map(c => c.columnDef.header).join('\t')
    const body = table.getRowModel().flatRows.map(row => row.getVisibleCells().map(c => c.renderValue()).join('\t')).join('\n')
    navigator.clipboard.writeText(header + '\n' + body);
  }

  useEffect(() => {
    if (!isFirstRender.current) {
      localStorage.setItem(props.id + '.state', JSON.stringify(state));
    } else {
      isFirstRender.current = false;
    }
  }, [state, props.id]);

  function resetState() {
    console.log('Resetting state for ' + props.id + ':', state)
    setState(defaultState)
  }

  const table = useMaterialReactTable(
    {
      columns: props.columns
      , data: props.data
      , enablePagination: false
      , enableTableFooter: false
      , enableFacetedValues: true
      , enableColumnDragging: true
      , enableColumnOrdering: true
      , enableColumnResizing: true
      , enableRowVirtualization: props.virtual || false
      , enableColumnVirtualization: false
      , enableStickyHeader: true
      , enableExpanding: props.subrows || false
      , filterFromLeafRows: true
      , muiTableContainerProps: props.muiTableContainerProps
      , muiTopToolbarProps: { sx: { paddingTop: '0px', paddingBottom: '0px' } }
      , muiTableBodyRowProps: props.muiTableBodyRowProps
      , muiTablePaperProps: props.border ? {} : { sx: { border: 'none', boxShadow: 'none' } }
      , displayColumnDefOptions: {
        'mrt-row-expand': {
          enableResizing: true, //allow resizing
          size: 50, //make the expand column wider
        },
      }
      , icons: {
        ContentCopy: (props: any) => <ContentCopyIcon fontSize="small" {...props} />
        , SearchIcon: (props: any) => <SearchIcon fontSize="small" {...props} />
        , FilterListIcon: (props: any) => <FilterListIcon fontSize="small" {...props} />
        , FilterListOffIcon: (props: any) => <FilterListOffIcon fontSize="small" {...props} />
        , ViewColumnIcon: (props: any) => <ViewColumnIcon fontSize="small" {...props} />
        , DensityLargeIcon: (props: any) => <DensityLargeIcon fontSize="small" {...props} />
        , DensityMediumIcon: (props: any) => <DensityMediumIcon fontSize="small" {...props} />
        , DensitySmallIcon: (props: any) => <DensitySmallIcon fontSize="small" {...props} />
        , DragHandleIcon: (props: any) => <DragHandleIcon fontSize="small" {...props} />
        , MoreVertIcon: (props: any) => <MoreVertIcon fontSize="small" {...props} />
        , SyncAltIcon: (props: any) => <SyncAltIcon fontSize="small" {...props} />
        , ArrowDownwardIcon: (props: any) => <ArrowDownwardIcon fontSize="small" {...props} />
      }
      , state: {
        columnFilters: state.columnFilters
        , columnOrder: state.columnOrder
        , columnVisibility: state.columnVisibility
        , columnSizing: state.columnSizing
        , density: state.density
        , showColumnFilters: state.showColumnFilters
        , showGlobalFilter: state.showGlobalFilter
        , sorting: state.sorting
      }
      , onColumnFiltersChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onColumnFiltersChange from', state, 'to', updaterOrValue)
        newState.columnFilters = updaterOrValue instanceof Function ? updaterOrValue(state.columnFilters) : updaterOrValue
        setState(newState)
      })
      , onColumnVisibilityChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onColumnVisibilityChange from', state, 'to', updaterOrValue)
        newState.columnVisibility = updaterOrValue instanceof Function ? updaterOrValue(state.columnVisibility) : updaterOrValue
        setState(newState)
      })
      , onColumnOrderChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onColumnOrderChange from', state, 'to', updaterOrValue)
        newState.columnOrder = updaterOrValue instanceof Function ? updaterOrValue(state.columnOrder) : updaterOrValue
        newState.columnOrder = newState.columnOrder.filter(x => x ? true : false)
        setState(newState)
      })
      , onColumnSizingChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onColumnSizingChange from', state, 'to', updaterOrValue)
        newState.columnSizing = updaterOrValue instanceof Function ? updaterOrValue(state.columnSizing) : updaterOrValue || {}
        setState(newState)
      })
      , onDensityChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onDensityChange from', state, 'to', updaterOrValue)
        newState.density = updaterOrValue instanceof Function ? updaterOrValue(state.density) : updaterOrValue
        setState(newState)
      })
      , onShowColumnFiltersChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onShowColumnFiltersChange from', state, 'to', updaterOrValue)
        newState.showColumnFilters = updaterOrValue instanceof Function ? updaterOrValue(state.showColumnFilters) : updaterOrValue
        setState(newState)
      })
      , onShowGlobalFilterChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onShowGlobalFilterChange from', state, 'to', updaterOrValue)
        newState.showGlobalFilter = updaterOrValue instanceof Function ? updaterOrValue(state.showGlobalFilter) : updaterOrValue
        setState(newState)
      })
      , onSortingChange: (updaterOrValue => {
        const newState = { ...state }
        console.log(Date.now(), props.id + '.onSortingChange from', state, 'to', updaterOrValue)
        newState.sorting = updaterOrValue instanceof Function ? updaterOrValue(state.sorting) : updaterOrValue
        setState(newState)
      })
      , mrtTheme: {
        baseBackgroundColor: globalTheme.palette.mode === 'light' ? '#F8F8F8' : '#000'
        ,
      }
      , renderBottomToolbar: () => (
        <></>
      )
      , renderToolbarInternalActions: ({ table }) => (
        <Box>
          <Tooltip title="Copy current data to clipboard">
            <IconButton onClick={() => copy(table)} sx={{ borderRadius: '10%', border: '' }} >
              <ContentCopyIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <MRT_ToggleGlobalFilterButton table={table} sx={{ borderRadius: '10%' }} />
          <MRT_ToggleFiltersButton table={table} sx={{ borderRadius: '10%' }} />
          <MRT_ShowHideColumnsButton table={table} sx={{ borderRadius: '10%' }} />
          <MRT_ToggleDensePaddingButton table={table} sx={{ borderRadius: '10%' }} />
          <MRT_ToggleFullScreenButton table={table} sx={{ borderRadius: '10%' }} />
          <Tooltip title="Reset table layout">
            <IconButton onClick={() => resetState()} sx={{ borderRadius: '10%' }} >
              <SettingsBackupRestoreIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  );
  // console.log(Date.now(), 'Called useMaterialReactTable', state)

  return (<MaterialReactTable table={table} />)

}

export default MaterialTable;