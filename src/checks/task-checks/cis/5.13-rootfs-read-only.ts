import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_13_rootFsReadOnly: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.13"
  , title: 'RootFS read only'
  , description: "Ensure that the container's root filesystem is mounted as read only"
  , remediation: "You should add a --read-only flag at a container's runtime to enforce the container's root filesystem being mounted as read only."
  , remediationImpact: `Enabling --read-only at container runtime may break some container OS packages if a data writing strategy is not defined.

You should define what the container's data should and should not persist at runtime in order to decide which strategy to use.

Example:

Enable use --tmpfs for temporary file writes to /tmp
Use Docker shared data volumes for persistent data writes`
  , reference: ''
  , example: `
services:
  swarmview:
    image: ...
    deploy:
      ...
    read_only: true
    volumes:
      - type: tmpfs
        target: /tmp
  `

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.container) {
      if (args.container.HostConfig?.ReadonlyRootfs) {
        return {
          state: State.pass
        }
      } else {
        return {
          state: State.fail
          , message: 'ReadonlyRootfs not specified for container'
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