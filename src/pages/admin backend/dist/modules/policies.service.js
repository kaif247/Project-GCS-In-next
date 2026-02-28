"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesService = void 0;
const common_1 = require("@nestjs/common");
let PoliciesService = class PoliciesService {
    constructor() {
        this.policies = [
            { id: 'P-1', title: 'Safety Policy', category: 'Safety', summary: 'Test policy' },
        ];
    }
    findAll() {
        return this.policies;
    }
    findOne(id) {
        return this.policies.find(p => p.id === id);
    }
    create(policy) {
        this.policies.push(policy);
        return policy;
    }
    update(id, policy) {
        const idx = this.policies.findIndex(p => p.id === id);
        if (idx > -1) {
            this.policies[idx] = Object.assign(Object.assign({}, this.policies[idx]), policy);
            return this.policies[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.policies.findIndex(p => p.id === id);
        if (idx > -1) {
            const removed = this.policies.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
PoliciesService = __decorate([
    (0, common_1.Injectable)()
], PoliciesService);
exports.PoliciesService = PoliciesService;
//# sourceMappingURL=policies.service.js.map