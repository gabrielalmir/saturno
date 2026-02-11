import HolidayController from './HolidayController'
import JiraImportController from './JiraImportController'
import SprintCapacityController from './SprintCapacityController'
import UserAvailabilityController from './UserAvailabilityController'
import WorkItemAllocationController from './WorkItemAllocationController'

const Api = {
    UserAvailabilityController: Object.assign(UserAvailabilityController, UserAvailabilityController),
    HolidayController: Object.assign(HolidayController, HolidayController),
    WorkItemAllocationController: Object.assign(WorkItemAllocationController, WorkItemAllocationController),
    SprintCapacityController: Object.assign(SprintCapacityController, SprintCapacityController),
    JiraImportController: Object.assign(JiraImportController, JiraImportController),
}

export default Api