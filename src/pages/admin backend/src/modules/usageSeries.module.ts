import { Module } from '@nestjs/common';
import { UsageSeriesController } from './usageSeries.controller';
import { UsageSeriesService } from './usageSeries.service';

@Module({
  controllers: [UsageSeriesController],
  providers: [UsageSeriesService],
})
export class UsageSeriesModule {}
