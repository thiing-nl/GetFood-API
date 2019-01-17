"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const swagger_1 = require("@tsed/swagger");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const CheckCalendarId_1 = require("../../middlewares/calendars/CheckCalendarId");
const CalendarEvent_1 = require("../../../src/models/events/CalendarEvent");
const CalendarEventsService_1 = require("../../../src/services/calendars/CalendarEventsService");
let EventsCtrl = class EventsCtrl {
    constructor(calendarEventsService) {
        this.calendarEventsService = calendarEventsService;
    }
    /**
     *
     * @returns {null}
     */
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarEventsService
                .find(id)
                .catch((err) => {
                throw new ts_httpexceptions_1.NotFound('Event not found');
            });
        });
    }
    /**
     *
     * @returns {null}
     */
    save(calendarId, calendarEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            calendarEvent.calendarId = calendarId;
            return this.calendarEventsService.save(calendarEvent);
        });
    }
    /**
     *
     * @returns {null}
     */
    update(calendarId, id, calendarEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            return this
                .calendarEventsService
                .find(id)
                .then(() => this.calendarEventsService.save(calendarEvent))
                .catch((err) => {
                throw new ts_httpexceptions_1.NotFound('Calendar id not found');
            });
        });
    }
    /**
     *
     */
    remove(calendarId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarEventsService.remove(id);
        });
    }
    getEvents(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarEventsService.query(calendarId);
        });
    }
};
__decorate([
    common_1.Get('/:id'),
    common_1.UseBefore(CheckCalendarId_1.CheckCalendarIdMiddleware),
    swagger_1.Summary('Get an event from his ID'),
    common_1.Status(200, { description: 'Success' }),
    __param(0, swagger_1.Description('The event id')),
    __param(0, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "get", null);
__decorate([
    common_1.Put('/'),
    common_1.UseBefore(CheckCalendarId_1.CheckCalendarIdMiddleware),
    swagger_1.Summary('Create an event'),
    common_1.Status(201, { description: 'Created' }),
    __param(0, swagger_1.Description('The calendar id of the event')),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('calendarId')),
    __param(1, common_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CalendarEvent_1.CalendarEvent]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "save", null);
__decorate([
    common_1.Post('/:id'),
    common_1.UseBefore(CheckCalendarId_1.CheckCalendarIdMiddleware),
    swagger_1.Summary('Update event information'),
    common_1.Status(200, { description: 'Success' }),
    __param(0, swagger_1.Description('The calendar id of the event')),
    __param(0, common_1.Required()),
    __param(0, common_1.PathParams('calendarId')),
    __param(1, swagger_1.Description('The event id')),
    __param(1, common_1.PathParams('id')),
    __param(2, common_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CalendarEvent_1.CalendarEvent]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "update", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.Authenticated(),
    common_1.UseBefore(CheckCalendarId_1.CheckCalendarIdMiddleware),
    swagger_1.Summary('Remove an event'),
    common_1.Status(204, { description: 'No content' }),
    __param(0, swagger_1.Description('The calendar id of the event')),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('calendarId')),
    __param(1, swagger_1.Description('The event id')),
    __param(1, common_1.PathParams('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "remove", null);
__decorate([
    common_1.Get('/'),
    common_1.UseBefore(CheckCalendarId_1.CheckCalendarIdMiddleware),
    swagger_1.Summary('Get all events for a calendar'),
    common_1.Status(200, { description: 'Success' }),
    __param(0, swagger_1.Description('The calendar id of the event')),
    __param(0, common_1.Required()), __param(0, common_1.PathParams('calendarId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsCtrl.prototype, "getEvents", null);
EventsCtrl = __decorate([
    common_1.Controller('/:calendarId/events'),
    common_1.MergeParams(true),
    __metadata("design:paramtypes", [CalendarEventsService_1.CalendarEventsService])
], EventsCtrl);
exports.EventsCtrl = EventsCtrl;
//# sourceMappingURL=EventsCtrl.js.map
