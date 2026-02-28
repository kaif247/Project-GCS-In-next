"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
let AnnouncementsService = class AnnouncementsService {
    constructor() {
        this.announcements = [
            { id: 'A-1', title: 'Welcome', detail: 'Welcome to the admin dashboard.' },
        ];
    }
    findAll() {
        return this.announcements;
    }
    findOne(id) {
        return this.announcements.find(a => a.id === id);
    }
    create(announcement) {
        this.announcements.push(announcement);
        return announcement;
    }
    update(id, announcement) {
        const idx = this.announcements.findIndex(a => a.id === id);
        if (idx > -1) {
            this.announcements[idx] = Object.assign(Object.assign({}, this.announcements[idx]), announcement);
            return this.announcements[idx];
        }
        return null;
    }
    remove(id) {
        const idx = this.announcements.findIndex(a => a.id === id);
        if (idx > -1) {
            const removed = this.announcements.splice(idx, 1);
            return removed[0];
        }
        return null;
    }
};
AnnouncementsService = __decorate([
    (0, common_1.Injectable)()
], AnnouncementsService);
exports.AnnouncementsService = AnnouncementsService;
//# sourceMappingURL=announcements.service.js.map