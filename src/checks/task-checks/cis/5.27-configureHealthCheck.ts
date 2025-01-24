import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_27_configureHealthCheck: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.27"
  , title: "Configure health check"
  , description: "Ensure that container health is checked at runtime"
  , remediation: `You should run the container using the --health-cmd parameter.`
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.Config?.Healthcheck) {
        if (args.container.Config.Healthcheck.Test) {
          return {
            state: State.pass
          }
        } else {
          return {
            state: State.fail
            , message: "No test configured in health check"
          }
        }
      } else {
        return {
          state: State.fail
          , message: "No health check configured"
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