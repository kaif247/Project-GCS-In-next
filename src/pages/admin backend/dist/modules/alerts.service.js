"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
let AlertsService = class AlertsService {
    constructor() {
        this.alerts = [
            { id: 'AL-1', title: 'System Alert', severity: 'High', message: 'Test alert' },
        ];
    }
    findAll() {
        return this.alerts;
    }
    findOne(id) {
        return this.alerts.find(a => a.id === id);
    }
    create(alert) {
        this.alerts.push(alert);
        return alert;
    }
    update(id, alert) {
        const idx = this.alerts.findIndex(a => a.id === id);
        if (idx > -1) {
            this.alerts[idx] = Object.assign(Object.assign({}, this.alerts[idx]), alert);
            return this.alerts[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.alerts.findIndex(a => a.id === id);
        if (idx > -1) {
            const removed = this.alerts.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
AlertsService = __decorate([
    (0, common_1.Injectable)()
], AlertsService);
exports.AlertsService = AlertsService;
//# sourceMappingURL=alerts.service.js.map