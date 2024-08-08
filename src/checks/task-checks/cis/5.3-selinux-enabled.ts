import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const cis_5_3_seLinuxEnabled: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.3"
  , title: 'SELinux Enabled'
  , description: "Ensure that, if applicable, SELinux security options are set (Automated)"
  , remediation: "Set the SELinux State. Set the SELinux Policy. Create or import a SELinux policy template for Docker containers. Start Docker in daemon mode with SELinux enabled. Start your Docker container using the security options."
  , remediationImpact: "Any restrictions defined in the SELinux policy will be applied to your containers. It should be noted that if your SELinux policy is misconfigured, this may have an impact on the correct operation of the affected containers."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.system && args.system.SecurityOptions && !args.system.SecurityOptions.find(v => v === 'name=selinux')) {
      return {
        state: State.pass
        , message: 'SELinux not in use'
      }
    }
    if (args.task) {
      if (args.task?.Spec?.ContainerSpec?.Privileges?.SELinuxContext) {
        return {
          state: args.task?.Spec?.ContainerSpec?.Privileges?.SELinuxContext.Disable ? State.fail : State.pass
        }
      } else {
        return {
          state: State.warning
          , message: 'SELinux not configured'
        }
      }
    } else {
      return {
        state: State.error
        , message: 'task not set'
      }
    }
  }
}