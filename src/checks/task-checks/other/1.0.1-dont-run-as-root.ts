import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_1_dontRunAsRoot: Check = {
  category: "Other"
  , id: "1.0.1"
  , title: 'Don\'t run as root'
  , description: "Ensure containers do not run as root"
  , remediation: "Specify the user in either the compose file or the dockerfile"
  , remediationImpact: ""
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.top) {
      const uidCol = args.top.Titles?.findIndex(t => t === 'UID')
      if (uidCol != null && uidCol >= 0) {
        const rootProcs = args.top.Processes?.filter(row => row[uidCol] === 'root' || row[uidCol] === '0')
        if (rootProcs && rootProcs.length > 0) {
          const cmdCol = args.top.Titles?.findIndex(t => t === 'CMD')
          if (cmdCol != null && cmdCol >= 0) {
            return {
              state: State.fail
              , message: 'Processes running as root: ' + rootProcs.map(p => p[cmdCol]).join(', ')
            }
          } else {
            return {
              state: State.fail
              , message: rootProcs.length + ' processes running as root'
            }
          }
        } else {
          return {
            state: State.pass
          }
        }
      } else {
        return {
          state: State.warning
          , message: 'Unable to find UID column in top data' + uidCol
        }
      }
    } else {
      return {
        state: State.error
        , message: 'process information from container not set'
      }
    }
  }
}