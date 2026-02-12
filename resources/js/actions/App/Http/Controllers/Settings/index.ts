import ProfileController from './ProfileController'
import PasswordController from './PasswordController'
import OrganizationController from './OrganizationController'
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