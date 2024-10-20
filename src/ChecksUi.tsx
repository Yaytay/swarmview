import Grid from "@mui/material/Grid2";
import Section from "./Section";
import { Check, CheckArguments, State } from "./checks/checks";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/system/Box";
import Link from "@mui/material/Link";
import ChecksTable, { CheckDetails, createCheckDetails } from "./tables/ChecksTable";

interface ChecksUiProps {
  id: string
  , checks: Check[]
  , args: CheckArguments
}
class CheckResultsCategory {
  category: string
  data: CheckDetails[]

  constructor(category: string, row: CheckDetails) {
    this.category = category
    this.data = [row]
  }

  add(row: CheckDetails) {
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

  function evaluate(check: Check, args: CheckArguments) {
    try {
      const result = check.evaluate(args)
      return createCheckDetails(check, result)
    } catch (ex) {
      return createCheckDetails(check, {state: State.error, message: String(ex)})
    }
  }

  const data = props.checks.reduce((acc, check) => {
    const details = evaluate(check, props.args)
    if (acc.length === 0 || acc[acc.length - 1].category !== check.category) {
      acc.push(new CheckResultsCategory(check.category, details))
    } else {
      acc[acc.length - 1].add(details)
    }
    return acc
  }, [] as CheckResultsCategory[])

  return (
    <Grid container spacing={2} >
      {data.map(cat => {
        return (
          <Section key={props.id + '.' + cat.category} id={props.id + '.' + cat.category} heading={cat.category} xs={12}>
            <ChecksTable id={props.id + ".table"} checks={cat.data} />
          </Section>
        )
      })}
      <CheckDialog check={checkDetails} onClose={() => setCheckDetails(undefined)} />
    </Grid>
  )
}

export default ChecksUi