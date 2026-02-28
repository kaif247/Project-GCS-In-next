import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private admin = { username: 'admin', password: 'admin123' };
  private isLoggedIn = false;

  login(credentials: { username: string; password: string }) {
    if (
      credentials.username === this.admin.username &&
      credentials.password === this.admin.password
    ) {
      this.isLoggedIn = true;
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  logout() {
    this.isLoggedIn = false;
    return { success: true, message: 'Logged out' };
  }
}
