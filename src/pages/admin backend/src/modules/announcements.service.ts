import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementsService {
  private announcements = [
    { id: 'A-1', title: 'Welcome', detail: 'Welcome to the admin dashboard.' },
    // Add more seed announcements as needed
  ];

  findAll() {
    return this.announcements;
  }

  findOne(id: string) {
    return this.announcements.find(a => a.id === id);
  }

  create(announcement: any) {
    this.announcements.push(announcement);
    return announcement;
  }

  update(id: string, announcement: any) {
    const idx = this.announcements.findIndex(a => a.id === id);
    if (idx > -1) {
      this.announcements[idx] = { ...this.announcements[idx], ...announcement };
      return this.announcements[idx];
    }
    return null;
  }

  remove(id: string) {
    const idx = this.announcements.findIndex(a => a.id === id);
    if (idx > -1) {
      const removed = this.announcements.splice(idx, 1);
      return removed[0];
    }
    return null;
  }
}
