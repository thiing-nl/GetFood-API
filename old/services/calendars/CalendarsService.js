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
const ts_log_debug_1 = require("ts-log-debug");
const Calendar_1 = require("../../models/calendars/Calendar");
let CalendarsService = class CalendarsService {
    constructor(calendarModel) {
        this.calendarModel = calendarModel;
        this.reload();
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarModel
                .find({})
                .exec()
                .then((calendars) => {
                if (calendars.length === 0) {
                    this.calendarModel.create(...require('../../../resources/calendars.json'));
                }
            })
                .catch(err => console.error(err));
        });
    }
    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|Calendar}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            ts_log_debug_1.$log.debug('Search a calendar from ID', id);
            const calendar = yield this.calendarModel.findById(id).exec();
            ts_log_debug_1.$log.debug('Found', calendar);
            return calendar;
        });
    }
    /**
     *
     * @param calendar
     * @returns {Promise<TResult|TResult2|Calendar>}
     */
    save(calendar) {
        return __awaiter(this, void 0, void 0, function* () {
            ts_log_debug_1.$log.debug({ message: 'Validate calendar', calendar });
            // const m = new CModel(calendar);
            // console.log(m);
            // await m.update(calendar, {upsert: true});
            const model = new this.calendarModel(calendar);
            ts_log_debug_1.$log.debug({ message: 'Save calendar', calendar });
            yield model.save();
            ts_log_debug_1.$log.debug({ message: 'Calendar saved', model });
            return model;
        });
    }
    /**
     *
     * @returns {Calendar[]}
     */
    query(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.calendarModel.find(options).exec();
        });
    }
    /**
     *
     * @param id
     * @returns {Promise<Calendar>}
     */
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.calendarModel.findById(id).remove().exec();
        });
    }
};
CalendarsService = __decorate([
    common_1.Service(),
    __param(0, common_1.Inject(Calendar_1.Calendar)),
    __metadata("design:paramtypes", [Object])
], CalendarsService);
exports.CalendarsService = CalendarsService;
//# sourceMappingURL=CalendarsService.js.map