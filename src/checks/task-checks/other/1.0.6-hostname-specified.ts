import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_6_hostname_specified: Check = {
  category: "Other"
  , id: "1.0.6"
  , title: 'Hostname specified'
  , description: "The configuration specifies a hostname for the container.  This does not directly cause problems but it can lead clients to connect to that hostname, which can caused extended periods of disconnect whilst their DNS entries timeout."
  , remediation: "Do not specify a hostname."
  , remediationImpact: ""
  , reference: ''
  , example: ``

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.service) {
      if (args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname) {
        return {
          state: State.warning
          , message: 'Hostname set to ' + args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname
        }
      } else {
        return {
          state: State.pass
        }
      }
    } else {
      return {
        state: State.error
        , message: 'service not set'
      }
    }
  }
}