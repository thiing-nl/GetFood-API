"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const testing_1 = require("@tsed/testing");
const chai_1 = require("chai");
const tools_1 = require("../../../test/tools");
const Calendar_1 = require("../../models/calendars/Calendar");
const CalendarsService_1 = require("./CalendarsService");
describe("CalendarsService", () => {
    describe("without IOC", () => {
        before(() => {
            this.model = {
                find: tools_1.Sinon.stub().returns({
                    exec: tools_1.Sinon.stub().returns(Promise.resolve([{}]))
                })
            };
            this.calendarsService = new CalendarsService_1.CalendarsService(this.model);
        });
        it("should do something", () => {
            chai_1.expect(this.calendarsService).to.be.an.instanceof(CalendarsService_1.CalendarsService);
        });
        it("should call model.find method", () => {
            this.model.find.should.have.been.calledWithExactly({});
        });
    });
    describe("via InjectorService to mock other service", () => {
        before(testing_1.inject([common_1.InjectorService], (injectorService) => {
            this.model = {
                find: tools_1.Sinon.stub().returns({
                    exec: tools_1.Sinon.stub().returns(Promise.resolve([{}]))
                })
            };
            const locals = new Map();
            locals.set(Calendar_1.Calendar, this.model);
            this.calendarsService = injectorService.invoke(CalendarsService_1.CalendarsService, locals);
        }));
        it("should do something", () => {
            chai_1.expect(this.calendarsService).to.be.an.instanceof(CalendarsService_1.CalendarsService);
        });
        it("should call model.find method", () => {
            this.model.find.should.have.been.calledWithExactly({});
        });
    });
});
//# sourceMappingURL=CalendarsService.spec.js.map