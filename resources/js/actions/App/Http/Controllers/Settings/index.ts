import OrganizationController from './OrganizationController'
import PasswordController from './PasswordController'
import ProfileController from './ProfileController'
import ProjectController from './ProjectController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'

const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
    PasswordController: Object.assign(PasswordController, PasswordController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
}

export default Settings