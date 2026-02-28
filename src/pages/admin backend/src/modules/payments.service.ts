import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private payments = [
    { id: 'PM-1', label: 'Revenue', value: '$1200' },
    { id: 'PM-2', label: 'Billing', value: '$300' },
    // Add more seed payments as needed
  ];

  findAll() {
    return this.payments;
  }
}
