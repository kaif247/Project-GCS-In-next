import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Post()
  create(@Body() incident: any) {
    return this.incidentsService.create(incident);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() incident: any) {
    return this.incidentsService.update(id, incident);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
