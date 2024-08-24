import Grid from "@mui/material/Grid";
import DataTable, { DataTableValue } from "./DataTable";
import Section from "./Section";
import { Check, CheckArguments } from "./checks/checks";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/system/Box";
import Link from "@mui/material/Link";

interface ChecksUiProps {
  id: string
  , checks: Check[]
  , args: CheckArguments
}
class CheckResultsCategory {
  category: string
  data: DataTableValue[][]

  constructor(category: string, row: DataTableValue[]) {
    this.category = category
    this.data = [row]
  }

  add(row: DataTableValue[]) {
    this.data.push(row)
  }
}

interface CheckDialogProps {
  check?: Check
  , onClose: () => void
}
function CheckDialog(props: CheckDialogProps) {

  const open: boolean = props.check ? true : false
  return (
    <Dialog open={open} onClose={() => props.onClose()}>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {props.check?.category} {props.check?.id} {props.check?.title}
      </DialogTitle>
      <Box sx={{ padding: '0px 24px 32px 24px' }}>
        {props.check?.description &&
          (
            <Box>
              <Typography>{props.check.description}</Typography>
            </Box>
          )
        }
        {props.check?.remediation &&
          (
            <Box>
              <h4>Remediation</h4>
              <Typography>{props.check.remediation}</Typography>
            </Box>
          )
        }
        {props.check?.remediationImpact &&
          (
            <Box>
              <h4>Remediation Impact</h4>
              <Typography>{props.check.remediationImpact}</Typography>
            </Box>
          )
        }
        {props.check?.reference &&
          (
            <Box>
              <h4>Reference</h4>
              <Link href={props.check.reference} target="_blank" rel="noreferrer"><Typography>{props.check.reference}</Typography></Link>
            </Box>
          )
        }
      </Box>
    </Dialog>
  );
}

function ChecksUi(props: ChecksUiProps) {

  const [checkDetails, setCheckDetails] = useState<Check | undefined>()

  const headers = ['ID', 'CHECK', 'RESULT', 'THRESHOLD', 'VALUE', 'MESSAGE']

  function evaluate(check: Check, args: CheckArguments) {
    try {
      const result = check.evaluate(args)
      return [check.id
        , { children: (<Tooltip placement="bottom-start" title={check.description}><Typography onClick={() => setCheckDetails(check)}>{check.title}</Typography></Tooltip>), value: check.title }
        , result.state, result.threshold, result.value, result.message]
    } catch (ex) {
      return [check.id
        , { children: (<Tooltip placement="bottom-start" title={check.description}><span>{check.title}</span></Tooltip>), value: check.title }
        , 'error', null, null, String(ex)]
    }
  }

  const data = props.checks.reduce((acc, check) => {
    const row = evaluate(check, props.args)
    if (acc.length === 0 || acc[acc.length - 1].category !== check.category) {
      acc.push(new CheckResultsCategory(check.category, row))
    } else {
      acc[acc.length - 1].add(row)
    }
    return acc
  }, [] as CheckResultsCategory[])

  return (
    <Grid container spacing={2} >
      {data.map(cat => {
        return (
          <Section key={props.id + '.' + cat.category} id={props.id + '.' + cat.category} heading={cat.category} xs={12}>
            <DataTable id={props.id + ".table"} headers={headers} rows={cat.data} rowStyle={r => {
              switch (r[2]) {
                case 'fail':
                  return { background: 'red' }
                case 'error':
                  return { background: 'darkred' }
                case 'warning':
                  return { background: 'yellow' }
              }
            }} >
            </DataTable>
          </Section>
        )
      })}
      <CheckDialog check={checkDetails} onClose={() => setCheckDetails(undefined)} />
    </Grid>
  )
}

export default ChecksUi