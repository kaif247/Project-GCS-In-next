"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsService = void 0;
const common_1 = require("@nestjs/common");
let IncidentsService = class IncidentsService {
    constructor() {
        this.incidents = [
            { id: 'INC-1', title: 'Login outage', severity: 'High', status: 'Open' },
        ];
    }
    findAll() {
        return this.incidents;
    }
    findOne(id) {
        return this.incidents.find(i => i.id === id);
    }
    create(incident) {
        this.incidents.push(incident);
        return incident;
    }
    update(id, incident) {
        const idx = this.incidents.findIndex(i => i.id === id);
        if (idx > -1) {
            this.incidents[idx] = Object.assign(Object.assign({}, this.incidents[idx]), incident);
            return this.incidents[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.incidents.findIndex(i => i.id === id);
        if (idx > -1) {
            const removed = this.incidents.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
IncidentsService = __decorate([
    (0, common_1.Injectable)()
], IncidentsService);
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents.service.js.map