import { Check, CheckArguments, CheckResult, State } from "../../checks"

const unacceptable_mounts = ['/', '/boot', '/dev', '/etc', '/lib', '/proc', '/sys', '/usr']

export const cis_5_6_sensitiveDirectories: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.6"
  , title: 'Sensitive directories'
  , description: "Ensure sensitive host system directories are not mounted on containers (Automated)"
  , remediation: "You should not mount directories which are security sensitive on the host within containers, especially in read-write mode."
  , remediationImpact: "None."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.task) {
      if (args.task.Spec?.ContainerSpec?.Mounts) {
        const badMountsRw: string[] = []
        const badMountsRo: string[] = []

        args.task.Spec?.ContainerSpec?.Mounts.forEach(mnt => {
          if (unacceptable_mounts.find(v => v === mnt.Source)) {
            if (mnt.Source) {
              if (mnt.ReadOnly) {
                badMountsRo.push(mnt.Source)
              } else {
                badMountsRw.push(mnt.Source)
              }
            }
          }
        })

        if (badMountsRw.length) {
          return {
            state: State.fail
            , message: 'The following dirs are mounted read/write: ' + badMountsRw.join(', ')
          }  
        } else if(badMountsRo.length) {
          return {
            state: State.warning
            , message: 'The following dirs are mounted read only: ' + badMountsRo.join(', ')
          }  
        } else {
          return {
            state: State.pass
          }
        }
      } else {
        return {
          state: State.pass
        }
      }
    } else {
      return {
        state: State.error
        , message: 'container not set'
      }
    }
  }
}