import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, PieController, ArcElement, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';
import { EmployeeService } from '../../services/employee.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// ✅ Register the plugin & chart elements
Chart.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels);


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})


export class PieChartComponent implements OnInit {
  pieChartData: any;
  pieChartOptions!: ChartOptions<'pie'>;
  plugins: Plugin<'pie'>[] = [ChartDataLabels];  // ✅ correctly typed

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    const pastelColors = [
      '#B5838D', '#FFB4A2', '#FFCDB2', '#E5989B',
      '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB',
      '#F4BFBF', '#A2D2FF'
    ];

    this.employeeService.getEmployeesByTotalHours().subscribe(data => {
      const total = data.reduce((sum, emp) => sum + emp.totalHours, 0);
      const labels = data.map(emp => emp.name);
      const values = data.map(emp => ((emp.totalHours / total) * 100).toFixed(2));

      this.pieChartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: pastelColors.slice(0, data.length),
            borderWidth: 0
          }
        ]
      };

      this.pieChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          },
          datalabels: {
             color: '#000', 
            formatter: (value: any) => `${value}%`
          }
        }
      };
    });
  }
}

