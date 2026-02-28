import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  create(@Body() announcement: any) {
    return this.announcementsService.create(announcement);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() announcement: any) {
    return this.announcementsService.update(id, announcement);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
