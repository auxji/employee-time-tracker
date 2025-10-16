import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, name: 'Alice', position: 'Developer', totalHours: 160, department: 'Engineering' },
    { id: 2, name: 'Bob', position: 'Designer', totalHours: 120, department: 'Design' },
    { id: 3, name: 'Charlie', position: 'PM', totalHours: 140, department: 'Product' }
  ];

  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }
}
