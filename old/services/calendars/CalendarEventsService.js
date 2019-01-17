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
var CalendarEventsService_1;
const common_1 = require("@tsed/common");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const lib_1 = require("ts-log-debug/lib");
const CalendarEvent_1 = require("../../models/events/CalendarEvent");
let CalendarEventsService = CalendarEventsService_1 = class CalendarEventsService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    /**
     * Find a CalendarEvent by his ID.
     * @param id
     * @returns {undefined|EventModel}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eventModel.findById(id).exec();
        });
    }
    /**
     *
     * @param event
     * @returns {Promise<CalendarEvent>}
     */
    save(event) {
        return __awaiter(this, void 0, void 0, function* () {
            CalendarEventsService_1.checkPrecondition(event);
            lib_1.$log.debug({ message: "Validate event", event });
            const eventModel = new this.eventModel(event);
            yield eventModel.validate();
            lib_1.$log.debug({ message: "Save event", eventModel });
            yield eventModel.update(event, { upsert: true });
            lib_1.$log.debug({ message: "Event saved", event });
            return eventModel;
        });
    }
    /**
     * Return all CalendarEvent for a calendarID.
     * @returns {CalendarEvent[]}
     */
    query(calendarId) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield this.eventModel
                .find({ calendarId: calendarId })
                .exec();
            return events;
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.eventModel.findById(id).remove().exec();
        });
    }
    /**
     *
     * @param event
     */
    static checkPrecondition(event) {
        if (event.dateStart.getTime() > event.dateEnd.getTime()) {
            new ts_httpexceptions_1.BadRequest("dateStart to be under dateEnd.");
        }
    }
};
CalendarEventsService = CalendarEventsService_1 = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(CalendarEvent_1.CalendarEvent)),
    __metadata("design:paramtypes", [Object])
], CalendarEventsService);
exports.CalendarEventsService = CalendarEventsService;
//# sourceMappingURL=CalendarEventsService.js.map