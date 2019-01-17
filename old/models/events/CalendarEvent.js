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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const mongoose_1 = require("@tsed/mongoose");
const swagger_1 = require("@tsed/swagger");
const Calendar_1 = require("../calendars/Calendar");
let CalendarEvent = class CalendarEvent {
    constructor() {
        this.dateCreate = new Date();
        this.dateUpdate = new Date();
        this.dateStart = new Date();
        this.dateEnd = new Date();
    }
};
__decorate([
    mongoose_1.Ref(Calendar_1.Calendar),
    swagger_1.Description("Calendar ID"),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "calendarId", void 0);
__decorate([
    common_1.Property("name"),
    swagger_1.Description("The name of the event"),
    __metadata("design:type", String)
], CalendarEvent.prototype, "name", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Creation's date"),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "dateCreate", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Last modification date"),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "dateUpdate", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Beginning date of the event"),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "dateStart", void 0);
__decorate([
    common_1.Property(),
    common_1.Required(),
    swagger_1.Description("Ending date of the event"),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "dateEnd", void 0);
__decorate([
    common_1.Property(),
    swagger_1.Description("Description the event"),
    __metadata("design:type", String)
], CalendarEvent.prototype, "description", void 0);
CalendarEvent = __decorate([
    mongoose_1.Model()
], CalendarEvent);
exports.CalendarEvent = CalendarEvent;
//# sourceMappingURL=CalendarEvent.js.map