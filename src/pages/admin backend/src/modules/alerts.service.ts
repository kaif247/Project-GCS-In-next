import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {
  private alerts = [
    { id: 'AL-1', title: 'System Alert', severity: 'High', message: 'Test alert' },
    // Add more seed alerts as needed
  ];

  findAll() {
    return this.alerts;
  }

  findOne(id: string) {
    return this.alerts.find(a => a.id === id);
  }

  create(alert: any) {
    this.alerts.push(alert);
    return alert;
  }

  update(id: string, alert: any) {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx > -1) {
      this.alerts[idx] = { ...this.alerts[idx], ...alert };
      return this.alerts[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx > -1) {
      const removed = this.alerts.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
