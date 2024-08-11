import Grid from "@mui/material/Grid";
import DataTable, { DataTableValue } from "./DataTable";
import Section from "./Section";
import { Check, CheckArguments } from "./checks/checks";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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
function evaluate(check: Check, args: CheckArguments) {
  try {
    const result = check.evaluate(args)
    return [check.id
      , {children: (<Tooltip placement="bottom-start" title={check.description}><Typography>{check.title}</Typography></Tooltip>), value: check.title}
      , result.state, result.threshold, result.value, result.message]
  } catch (ex) {
    return [check.id
      , {children: (<Tooltip placement="bottom-start" title={check.description}><span>{check.title}</span></Tooltip>), value: check.title}
      , 'error', null, null, String(ex)]
  }
}
function ChecksUi(props: ChecksUiProps) {

  const headers = ['ID', 'CHECK', 'RESULT', 'THRESHOLD', 'VALUE', 'MESSAGE']

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
          <Section id={props.id} heading={cat.category} xs={12}>
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
    </Grid>
  )
}

export default ChecksUi