import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable, using } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'http://localhost:5200';
  users$ = signal<User[]>([]);
  user$ = signal<User>({} as User);

  constructor(private httpClient: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
  getProtectedData(): Observable<any> {
    return this.httpClient.get(`${this.url}/employees`, {
      headers: this.getAuthHeaders(),
    });
  }

  createUser(user: User) {
    return this.httpClient.post(`${this.url}/register`, user, {
      responseType: 'text',
    });
  }

  loginUser(user: User) {
    return this.httpClient.post(`${this.url}/login`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', // Ensure the backend expects JSON
      }),
    });
  }

  storeToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
