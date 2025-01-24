import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_22_dontDisableDefaultSeccomp: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.22"
  , title: "Don't disable default seccomp profile"
  , description: "Ensure the default seccomp profile is not Disabled"
  , remediation: "By default, seccomp profiles are enabled. You do not need to do anything unless you want to modify and use a modified seccomp profile."
  , remediationImpact: `With Docker 1.10 and greater, the default seccomp profile blocks syscalls, regardless of --cap-add passed to the container. You should create your own custom seccomp profile in such cases. You may also disable the default seccomp profile by passing --security-opt=seccomp:unconfined on docker run.`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.SecurityOpt?.includes('seccomp:unconfined')) {
        return {
          state: State.fail
          , message: "Security options: " + args.container.HostConfig?.SecurityOpt.join(", ")
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