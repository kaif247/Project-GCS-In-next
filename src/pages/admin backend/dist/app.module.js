"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./modules/users.module");
const reports_module_1 = require("./modules/reports.module");
const flags_module_1 = require("./modules/flags.module");
const announcements_module_1 = require("./modules/announcements.module");
const alerts_module_1 = require("./modules/alerts.module");
const policies_module_1 = require("./modules/policies.module");
const incidents_module_1 = require("./modules/incidents.module");
const audit_module_1 = require("./modules/audit.module");
const payments_module_1 = require("./modules/payments.module");
const usageSeries_module_1 = require("./modules/usageSeries.module");
const auth_module_1 = require("./modules/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, reports_module_1.ReportsModule, flags_module_1.FlagsModule, announcements_module_1.AnnouncementsModule, alerts_module_1.AlertsModule, policies_module_1.PoliciesModule, incidents_module_1.IncidentsModule, audit_module_1.AuditModule, payments_module_1.PaymentsModule, usageSeries_module_1.UsageSeriesModule, auth_module_1.AuthModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map