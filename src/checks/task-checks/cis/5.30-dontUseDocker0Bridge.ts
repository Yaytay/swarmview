import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_30_dontUseDocker0Bridge: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.30"
  , title: "Don't use default bridge 'docker0'"
  , description: "Ensure that Docker's default bridge \"docker0\" is not used"
  , remediation: `You should follow the Docker documentation and set up a user-defined network. All the containers should be run in this network.`
  , remediationImpact: `User-defined networks need to be configured and managed in line with organizational security policy.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container?.NetworkSettings?.Networks) {
        if (Object.keys(args.container?.NetworkSettings?.Networks).includes('docker0')) {
          return {
            state: State.fail
            , message: 'Uses networks: ' + Object.keys(args.container?.NetworkSettings?.Networks).join(', ')
          }
        } else {
          return {
            state: State.pass
          }
        }
      } else {
        return {
          state: State.pass
          , message: 'No networks defined'
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