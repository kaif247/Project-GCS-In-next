import { Injectable } from '@nestjs/common';

@Injectable()
export class UsageSeriesService {
  private usageSeries = [
    { label: 'Mon', value: 80 },
    { label: 'Tue', value: 60 },
    { label: 'Wed', value: 90 },
    // Add more seed usage data as needed
  ];

  findAll() {
    return this.usageSeries;
  }
}
