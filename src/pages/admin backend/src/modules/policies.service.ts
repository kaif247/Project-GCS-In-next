import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliciesService {
  private policies = [
    { id: 'P-1', title: 'Safety Policy', category: 'Safety', summary: 'Test policy' },
    // Add more seed policies as needed
  ];

  findAll() {
    return this.policies;
  }

  findOne(id: string) {
    return this.policies.find(p => p.id === id);
  }

  create(policy: any) {
    this.policies.push(policy);
    return policy;
  }

  update(id: string, policy: any) {
    const idx = this.policies.findIndex(p => p.id === id);
    if (idx > -1) {
      this.policies[idx] = { ...this.policies[idx], ...policy };
      return this.policies[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.policies.findIndex(p => p.id === id);
    if (idx > -1) {
      const removed = this.policies.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
