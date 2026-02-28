"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsService = void 0;
const common_1 = require("@nestjs/common");
let FlagsService = class FlagsService {
    constructor() {
        this.flags = [
            { id: 'F-1', name: 'Beta Feature', rollout: '50%', status: 'On' },
        ];
    }
    findAll() {
        return this.flags;
    }
    findOne(id) {
        return this.flags.find(f => f.id === id);
    }
    create(flag) {
        this.flags.push(flag);
        return flag;
    }
    update(id, flag) {
        const idx = this.flags.findIndex(f => f.id === id);
        if (idx > -1) {
            this.flags[idx] = Object.assign(Object.assign({}, this.flags[idx]), flag);
            return this.flags[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.flags.findIndex(f => f.id === id);
        if (idx > -1) {
            const removed = this.flags.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
FlagsService = __decorate([
    (0, common_1.Injectable)()
], FlagsService);
exports.FlagsService = FlagsService;
//# sourceMappingURL=flags.service.js.map