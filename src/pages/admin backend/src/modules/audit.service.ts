import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  private auditLog = [
    { id: 'A-1', actor: 'Admin - Kaif', action: 'Created alert', time: '2026-02-01' },
    // Add more seed audit entries as needed
  ];

  findAll() {
    return this.auditLog;
  }

  create(entry: any) {
    this.auditLog.unshift(entry);
    return entry;
  }
}
