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
import SprintController from './SprintController'
import VisaoMacroController from './VisaoMacroController'
import WorkCadenceController from './WorkCadenceController'
import WorkItemController from './WorkItemController'
import TicketController from './TicketController'
import Settings from './Settings'
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