import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  pieChartData: ChartData<'pie'> = {
    labels: ['Work', 'Break', 'Meeting'],
    datasets: [{ data: [40, 30, 30] }]
  };

  pieChartType: ChartType = 'pie';
}
