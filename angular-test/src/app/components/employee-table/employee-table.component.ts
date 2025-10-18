import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmployeeAggregate } from '../../models/employee-aggregate.model';
import { EmployeeService } from '../../services/employee.service';



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

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employees$ = this.employeeService.getEmployeesByTotalHours();
  }

  /*
* all data
  ngOnInit() {
  this.employeeService.logRawEntries();
}
*/

  onEdit(name: string) {
    alert(`Edit ${name} (future feature)`);
  }

  trackByName = (_: number, e: EmployeeAggregate) => e.name;
}
