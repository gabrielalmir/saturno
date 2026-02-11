import UserAvailabilityController from './UserAvailabilityController'
import HolidayController from './HolidayController'
import WorkItemAllocationController from './WorkItemAllocationController'
import SprintCapacityController from './SprintCapacityController'
import SprintN1ReservationController from './SprintN1ReservationController'
import JiraImportController from './JiraImportController'

const Api = {
    UserAvailabilityController: Object.assign(UserAvailabilityController, UserAvailabilityController),
    HolidayController: Object.assign(HolidayController, HolidayController),
    WorkItemAllocationController: Object.assign(WorkItemAllocationController, WorkItemAllocationController),
    SprintCapacityController: Object.assign(SprintCapacityController, SprintCapacityController),
    SprintN1ReservationController: Object.assign(SprintN1ReservationController, SprintN1ReservationController),
    JiraImportController: Object.assign(JiraImportController, JiraImportController),
}

export default Api