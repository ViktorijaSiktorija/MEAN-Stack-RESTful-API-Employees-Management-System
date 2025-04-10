import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Employee } from './employee';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = 'http://localhost:5200';
  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);

  constructor(
    private httpClient: HttpClient,
    private userService: UserService
  ) {}

  private getAuthHeaders() {
    return this.userService.getAuthHeaders();
  }

  private refreshEmployees() {
    this.httpClient
      .get<Employee[]>(`${this.url}/employees`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe((employees) => {
        this.employees$.set(employees);
      });
  }

  getEmployees() {
    this.refreshEmployees();
    return this.employees$();
  }

  getEmployee(id: string) {
    this.httpClient
      .get<Employee>(`${this.url}/employees/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .subscribe((employee) => {
        this.employee$.set(employee);
        return this.employee$();
      });
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.url}/employees`, employee, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  updateEmployee(id: string, employee: Employee) {
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/employees/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }
}
