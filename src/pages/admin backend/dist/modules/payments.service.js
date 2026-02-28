"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
let PaymentsService = class PaymentsService {
    constructor() {
        this.payments = [
            { id: 'PM-1', label: 'Revenue', value: '$1200' },
            { id: 'PM-2', label: 'Billing', value: '$300' },
        ];
    }
    findAll() {
        return this.payments;
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map