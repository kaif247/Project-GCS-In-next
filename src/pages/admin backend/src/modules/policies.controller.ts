import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PoliciesService } from './policies.service';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Get()
  findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(id);
  }

  @Post()
  create(@Body() policy: any) {
    return this.policiesService.create(policy);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() policy: any) {
    return this.policiesService.update(id, policy);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policiesService.remove(id);
  }
}
