import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 'U-1', name: 'Kaif', role: 'Admin', status: 'Active', joined: '2026-01-01' },
    // Add more seed users as needed
  ];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(u => u.id === id);
  }

  create(user: any) {
    this.users.push(user);
    return user;
  }

  update(id: string, user: any) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx > -1) {
      this.users[idx] = { ...this.users[idx], ...user };
      return this.users[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx > -1) {
      const removed = this.users.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
