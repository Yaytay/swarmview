import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const other_1_0_6_hostname_specified: Check = {
  category: "Other"
  , id: "1.0.6"
  , title: 'Hostname specified'
  , description: "The configuration specifies a hostname for the container.  This does not directly cause problems but it can lead clients to connect to that hostname, which can caused extended periods of disconnect whilst their DNS entries timeout."
  , remediation: "Do not specify a hostname other than {{.Service.Name}}-{{.Task.Slot}}-{{.Node.Hostname}}.  More importantly, do not address a container by hostname."
  , remediationImpact: ""
  , reference: ''
  , example: `
services:
  swarmview:
    ...
    hostname: "{{.Service.Name}}-{{.Task.Slot}}-{{.Node.Hostname}}"
    ...
  `

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.service) {
      if (args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname) {
        if ("{{.Service.Name}}-{{.Task.Slot}}-{{.Node.Hostname}}" === args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname) {
          return {
            state: State.pass
            , message: 'Hostname set to ' + args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname
          }
        } else {
          return {
            state: State.warning
            , message: 'Hostname set to ' + args.service?.Spec?.TaskTemplate?.ContainerSpec?.Hostname
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
        , message: 'service not set'
      }
    }
  }
}