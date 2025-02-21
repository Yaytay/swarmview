import MaterialTable from '../MaterialTable';
import { MRT_ColumnDef } from 'material-react-table';
import { Dimensions } from '../app-types';
import { Check, CheckResult, State } from '../checks/checks';
import { Paper, Tooltip, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

export interface CheckDetails {
  id: string
  result?: string
  message?: string
  check: Check
}
const checkColumns: MRT_ColumnDef<CheckDetails>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 100,
  },
  {
    accessorKey: 'check.title',
    header: 'CHECK',
    size: 300,
    Cell: ({ renderedCellValue, row }) => (<Tooltip placement="bottom-start" title={row.original.check.description}><span>{renderedCellValue}</span></Tooltip>)
  },
  {
    accessorKey: 'result',
    header: 'RESULT',
    filterVariant: 'select',
    size: 160,
  },
  {
    accessorKey: 'message',
    header: 'MESSAGE',
    size: 400,
  },
]

interface CheckDialogProps {
  open: boolean;
  check: Check | undefined;
  onClose: () => void;
}

function CheckDialog(props: CheckDialogProps) {

  const handleClose = () => {
    props.onClose();
  };

  if (!props.check) {
    return (<></>)
  } else {
    return (
      <Dialog onClose={handleClose} open={props.open}>
        <DialogTitle>{props.check.id} {props.check.title}</DialogTitle>
          <Paper sx={{ padding: '0px 24px 16px 24px' }}>
            {props.check.description}

            { props.check.remediation && (
              <>
              <Typography variant='h6' sx={{ marginTop: '16px' }}>Remediation</Typography>
              {props.check.remediation}
              </>
            ) }
            { props.check.remediationImpact && (
              <>
              <Typography variant='h6' sx={{ marginTop: '16px' }}>Remediation Impact</Typography>
              {props.check.remediationImpact}
              </>
            ) }
            { props.check.example && (
              <>
              <Typography variant='h6' sx={{ marginTop: '16px' }}>Example</Typography>
              <Typography>
                {props.check.example.trim()}
              </Typography>
              </>
            ) }
          </Paper>
      </Dialog>
    );
  }
}

interface ChecksTableProps {
  id: string
  checks: CheckDetails[]
  border?: boolean
  maxSize?: Dimensions
}
function ChecksTable(props: ChecksTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsCheck, setDetailsCheck] = useState<Check | undefined>();

  return (
    <>
      <MaterialTable
        id={props.id}
        columns={checkColumns}
        data={props.checks}
        border={props.border}
        virtual={false}
        muiTableContainerProps={props.maxSize ? { sx: { maxHeight: props.maxSize.height + 'px', maxWidth: props.maxSize.width + 'px' } } : {}}
        muiTableBodyRowProps={({ row }) => {
          const bg = row.original.result == State.error ? 'chocolate'
            : row.original.result == State.warning ? 'yellow'
              : row.original.result == State.fail ? 'red'
                : ''

          return {
            sx: { backgroundColor: bg }
            , onClick: (event) => {
              console.info(event, row.original);
              setDetailsCheck(row.original.check)
              setDetailsOpen(true)
            }
          }
        }}
      />
      <CheckDialog open={detailsOpen} check={detailsCheck} onClose={() => setDetailsOpen(false)} />
    </>
  )
}

export function createCheckDetails(check: Check, result: CheckResult): CheckDetails {
  return {
    id: check.id
    , check: check
    , result: result.state
    , message: result.message
  }
}

export default ChecksTable;