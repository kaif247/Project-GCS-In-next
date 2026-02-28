import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  private reports = [
    { id: 'R-1', user: 'Kaif', reason: 'Spam', status: 'Open', owner: 'Admin', content: 'Test report', time: '2026-02-01' },
    // Add more seed reports as needed
  ];

  findAll() {
    return this.reports;
  }

  findOne(id: string) {
    return this.reports.find(r => r.id === id);
  }

  create(report: any) {
    this.reports.push(report);
    return report;
  }

  update(id: string, report: any) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx > -1) {
      this.reports[idx] = { ...this.reports[idx], ...report };
      return this.reports[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.reports.findIndex(r => r.id === id);
    if (idx > -1) {
      const removed = this.reports.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
