import { Injectable } from '@nestjs/common';

@Injectable()
export class IncidentsService {
  private incidents = [
    { id: 'INC-1', title: 'Login outage', severity: 'High', status: 'Open' },
    // Add more seed incidents as needed
  ];

  findAll() {
    return this.incidents;
  }

  findOne(id: string) {
    return this.incidents.find(i => i.id === id);
  }

  create(incident: any) {
    this.incidents.push(incident);
    return incident;
  }

  update(id: string, incident: any) {
    const idx = this.incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      this.incidents[idx] = { ...this.incidents[idx], ...incident };
      return this.incidents[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.incidents.findIndex(i => i.id === id);
    if (idx > -1) {
      const removed = this.incidents.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
