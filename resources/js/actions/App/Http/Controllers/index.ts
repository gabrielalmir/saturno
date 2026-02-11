import HealthcheckController from './HealthcheckController'
import DashboardController from './DashboardController'
import VisaoMacroController from './VisaoMacroController'
import SprintController from './SprintController'
import WorkItemController from './WorkItemController'
import BoardController from './BoardController'
import BoardColumnController from './BoardColumnController'
import BoardItemController from './BoardItemController'
import IntegrationController from './IntegrationController'
import CalendarController from './CalendarController'
import Api from './Api'
import EpicController from './EpicController'
import TicketController from './TicketController'
import Settings from './Settings'
import CapacitySettingsController from './CapacitySettingsController'
import WorkCadenceController from './WorkCadenceController'
import TeamEventController from './TeamEventController'

const Controllers = {
    HealthcheckController: Object.assign(HealthcheckController, HealthcheckController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    VisaoMacroController: Object.assign(VisaoMacroController, VisaoMacroController),
    SprintController: Object.assign(SprintController, SprintController),
    WorkItemController: Object.assign(WorkItemController, WorkItemController),
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
    WorkCadenceController: Object.assign(WorkCadenceController, WorkCadenceController),
    TeamEventController: Object.assign(TeamEventController, TeamEventController),
}

export default Controllers