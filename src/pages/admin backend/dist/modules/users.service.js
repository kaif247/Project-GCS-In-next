"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    constructor() {
        this.users = [
            { id: 'U-1', name: 'Kaif', role: 'Admin', status: 'Active', joined: '2026-01-01' },
        ];
    }
    findAll() {
        return this.users;
    }
    findOne(id) {
        return this.users.find(u => u.id === id);
    }
    create(user) {
        this.users.push(user);
        return user;
    }
    update(id, user) {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx > -1) {
            this.users[idx] = Object.assign(Object.assign({}, this.users[idx]), user);
            return this.users[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx > -1) {
            const removed = this.users.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map