import { Check, CheckArguments, CheckResult, State } from "../../checks"

export const appArmorEnabled: Check = {
  category: "CIS Docker Benchmarks"
  , id: "5.2"
  , title: 'AppArmor Enabled'
  , description: "Ensure that, if applicable, an AppArmor Profile is enabled (Automated)"
  , remediation: "If AppArmor is applicable for your Linux OS, you should enable it. Alternatively, Docker's default AppArmor policy can be used."
  , remediationImpact: "The container will have the security controls defined in the AppArmor profile. It should be noted that if the AppArmor profile is misconfigured, this may cause issues with the operation of the container."
  , reference: ''

  , evaluate: function (args: CheckArguments): CheckResult {

    if (args.system && args.system.SecurityOptions && !args.system.SecurityOptions.find(v => v === 'name=apparmor')) {
      return {
        state: State.pass
        , message: 'AppArmor not in use'
      }
    }
    if (args.task) {
      if (args.task?.Spec?.ContainerSpec?.Privileges?.AppArmor) {
        return {
          state: args.task?.Spec?.ContainerSpec?.Privileges?.AppArmor.Mode == 'disabled' ? State.fail : State.pass
        }
      } else {
        return {
          state: State.warning
          , message: 'AppArmor not configured'
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