import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeAggregate } from '../../models/employee-aggregate.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  employees$!: Observable<EmployeeAggregate[]>;
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employees$ = this.employeeService.getEmployeesByTotalHours();
  }

  trackByName = (_: number, e: EmployeeAggregate) => e.name;
}
