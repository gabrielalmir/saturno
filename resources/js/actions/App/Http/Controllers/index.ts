import Api from './Api'
import BoardColumnController from './BoardColumnController'
import BoardController from './BoardController'
import BoardItemController from './BoardItemController'
import CalendarController from './CalendarController'
import CapacitySettingsController from './CapacitySettingsController'
import DashboardController from './DashboardController'
import EpicController from './EpicController'
import HealthcheckController from './HealthcheckController'
import IntegrationController from './IntegrationController'
import Settings from './Settings'
import SprintController from './SprintController'
import StoryController from './StoryController'
import TaskController from './TaskController'
import TicketController from './TicketController'
import WorkItemController from './WorkItemController'

const Controllers = {
    HealthcheckController: Object.assign(HealthcheckController, HealthcheckController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    SprintController: Object.assign(SprintController, SprintController),
    WorkItemController: Object.assign(WorkItemController, WorkItemController),
    StoryController: Object.assign(StoryController, StoryController),
    TaskController: Object.assign(TaskController, TaskController),
    BoardController: Object.assign(BoardController, BoardController),
    BoardColumnController: Object.assign(BoardColumnController, BoardColumnController),
    BoardItemController: Object.assign(BoardItemController, BoardItemController),
    IntegrationController: Object.assign(IntegrationController, IntegrationController),
    CalendarController: Object.assign(CalendarController, CalendarController),
    Api: Object.assign(Api, Api),
    EpicController: Object.assign(EpicController, EpicController),
    TicketController: Object.assign(TicketController, TicketController),
    Settings: Object.assign(Settings, Settings),
    CapacitySettingsController: Object.assign(CapacitySettingsController, CapacitySettingsController),
}

export default Controllers
