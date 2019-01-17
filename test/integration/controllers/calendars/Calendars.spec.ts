import { bootstrap } from "@tsed/testing";
import { Server } from "../../../../src/Server";

describe("Calendars", () => {

    // bootstrap your expressApplication in first
    before(bootstrap(Server));

    // then run your test
    describe("GET /rest/calendars", () => {
    });

});