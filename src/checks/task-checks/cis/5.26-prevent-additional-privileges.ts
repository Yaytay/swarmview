import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_26_preventAdditionalPrivileges: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.26"
  , title: "Prevent additional privileges"
  , description: "5.26 Ensure that the container is restricted from acquiring additional privileges"
  , remediation: `You should start your container with the options below:

docker run --rm -it --security-opt=no-new-privileges ubuntu bash`
  , remediationImpact: `The no_new_priv option prevents LSMs like SELinux from allowing processes to acquire new privileges`
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.Config?.Labels?.hasOwnProperty('com.docker.stack.namespace')) {
        return {
          state: State.info
          , message: "No way to set SecurityOptions on swarm"
        }
      }

      if (args.container.HostConfig?.SecurityOpt) {
        if (args.container.HostConfig?.SecurityOpt?.includes('no-new-privileges=true')) {
          return {
            state: State.pass
          }
        } else {
          return {
            state: State.fail
            , message: "Container is configured with cgroup " + args.container.HostConfig?.Cgroup
          }
        }
      } else {
        return {
          state: State.fail
          , message: "SecurityOptions not configured"
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