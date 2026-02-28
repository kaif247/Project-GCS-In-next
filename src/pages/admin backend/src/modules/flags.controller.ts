import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { FlagsService } from './flags.service';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  findAll() {
    return this.flagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flagsService.findOne(id);
  }

  @Post()
  create(@Body() flag: any) {
    return this.flagsService.create(flag);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() flag: any) {
    return this.flagsService.update(id, flag);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flagsService.remove(id);
  }
}
