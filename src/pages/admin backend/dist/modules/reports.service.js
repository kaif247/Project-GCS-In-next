"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
let ReportsService = class ReportsService {
    constructor() {
        this.reports = [
            { id: 'R-1', user: 'Kaif', reason: 'Spam', status: 'Open', owner: 'Admin', content: 'Test report', time: '2026-02-01' },
        ];
    }
    findAll() {
        return this.reports;
    }
    findOne(id) {
        return this.reports.find(r => r.id === id);
    }
    create(report) {
        this.reports.push(report);
        return report;
    }
    update(id, report) {
        const idx = this.reports.findIndex(r => r.id === id);
        if (idx > -1) {
            this.reports[idx] = Object.assign(Object.assign({}, this.reports[idx]), report);
            return this.reports[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.reports.findIndex(r => r.id === id);
        if (idx > -1) {
            const removed = this.reports.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
ReportsService = __decorate([
    (0, common_1.Injectable)()
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map