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
exports.UsageSeriesController = void 0;
const common_1 = require("@nestjs/common");
const usageSeries_service_1 = require("./usageSeries.service");
let UsageSeriesController = class UsageSeriesController {
    constructor(usageSeriesService) {
        this.usageSeriesService = usageSeriesService;
    }
    findAll() {
        return this.usageSeriesService.findAll();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsageSeriesController.prototype, "findAll", null);
UsageSeriesController = __decorate([
    (0, common_1.Controller)('usage-series'),
    __metadata("design:paramtypes", [usageSeries_service_1.UsageSeriesService])
], UsageSeriesController);
exports.UsageSeriesController = UsageSeriesController;
//# sourceMappingURL=usageSeries.controller.js.map