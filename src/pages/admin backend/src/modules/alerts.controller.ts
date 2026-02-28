import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Post()
  create(@Body() alert: any) {
    return this.alertsService.create(alert);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() alert: any) {
    return this.alertsService.update(id, alert);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(id);
  }
}
