import { Controller, Get } from '@nestjs/common';
import { UsageSeriesService } from './usageSeries.service';

@Controller('usage-series')
export class UsageSeriesController {
  constructor(private readonly usageSeriesService: UsageSeriesService) {}

  @Get()
  findAll() {
    return this.usageSeriesService.findAll();
  }
}
