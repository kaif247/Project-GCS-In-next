import { Injectable } from '@nestjs/common';

@Injectable()
export class FlagsService {
  private flags = [
    { id: 'F-1', name: 'Beta Feature', rollout: '50%', status: 'On' },
    // Add more seed flags as needed
  ];

  findAll() {
    return this.flags;
  }

  findOne(id: string) {
    return this.flags.find(f => f.id === id);
  }

  create(flag: any) {
    this.flags.push(flag);
    return flag;
  }

  update(id: string, flag: any) {
    const idx = this.flags.findIndex(f => f.id === id);
    if (idx > -1) {
      this.flags[idx] = { ...this.flags[idx], ...flag };
      return this.flags[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.flags.findIndex(f => f.id === id);
    if (idx > -1) {
      const removed = this.flags.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
