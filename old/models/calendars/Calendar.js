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
let Calendar = class Calendar {
};
__decorate([
    common_1.IgnoreProperty(),
    __metadata("design:type", String)
], Calendar.prototype, "_id", void 0);
__decorate([
    common_1.Property(),
    common_1.Required(),
    __metadata("design:type", String)
], Calendar.prototype, "name", void 0);
__decorate([
    common_1.Property(),
    common_1.Pattern(/romain|lili/),
    __metadata("design:type", String)
], Calendar.prototype, "owner", void 0);
Calendar = __decorate([
    mongoose_1.Model()
], Calendar);
exports.Calendar = Calendar;
//# sourceMappingURL=Calendar.js.map