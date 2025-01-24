import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_28_useMostRecentImage: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.28"
  , title: "Use most recent image"
  , description: "Ensure that Docker commands always make use of the latest version of their image"
  , remediation: `You should use proper version pinning mechanisms (the "latest" tag which is assigned by default is still vulnerable to caching attacks) to avoid extracting cached older versions. Version pinning mechanisms should be used for base images, packages, and entire images. You can customize version pinning rules according to your requirements.`
  , remediationImpact: ``
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container?.Config?.Image) {
      if (args.container.Config.Image?.endsWith(':latest') || args.container.Config.Image.indexOf(':latest@') >= 0) {
        return {
          state: State.fail
          , message: 'Do not use \'latest\' tag'
        }
      }
    }

    return {
      state: State.info
      , message: 'Cannot be tested'
    }
 }
}