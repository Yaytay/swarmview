import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_7_noSsh: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.7"
  , title: 'No SSH'
  , description: "Ensure sshd is not run within containers (Automated)"
  , remediation: "Uninstall the SSH daemon from the container and use docker exec to enter a container on the remote host."
  , remediationImpact: "None."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.top) {
      const sshProc = args.top.Processes?.find(proc => {proc[proc.length - 1].indexOf('ssh') >= 0})
      if (sshProc) {
        return {
          state: State.fail
          , message: 'Process: ' + sshProc[0] + " " + sshProc[sshProc.length - 1]
        }  
      } else {
        return {
          state: State.pass
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