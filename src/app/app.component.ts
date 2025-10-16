import { Component } from '@angular/core';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeTableComponent, PieChartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Employee Time Tracker';
}

