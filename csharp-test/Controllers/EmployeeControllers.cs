using Microsoft.AspNetCore.Mvc;
using EmployeeWorkTime.Models;
using Newtonsoft.Json.Linq;
using System.Windows.Forms.DataVisualization.Charting;


namespace EmployeeWorkTime.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly HttpClient _httpClient;

        public EmployeeController()
        {
            _httpClient = new HttpClient();
        }

        //  Table
        public async Task<IActionResult> Index()
        {
            var url = "https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==";
            var jsonString = await _httpClient.GetStringAsync(url);
            var jsonArray = JArray.Parse(jsonString);

            var employeeTotals = jsonArray
                .GroupBy(e => e["EmployeeName"]?.ToString() ?? "Unknown")
                .Select(g => new Employee
                {
                    EmployeeName = g.Key,
                    TotalTimeWorked = g.Sum(x =>
                    {
                        var start = x["StarTimeUtc"]?.ToObject<DateTime>();
                        var end = x["EndTimeUtc"]?.ToObject<DateTime>();
                        return (start != null && end != null) ? (end.Value - start.Value).TotalHours : 0;
                    }),
                    EntryNotes = g.Last()["EntryNotes"]?.ToString()
                })
                .OrderByDescending(e => e.TotalTimeWorked)
                .ToList();

           // await GeneratePieChart(employeeTotals);

            return View(employeeTotals);
        }

        // pie chart
        [HttpGet]
        public async Task<IActionResult> Chart()
        {
            var url = "https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==";
            var jsonString = await _httpClient.GetStringAsync(url);
            var jsonArray = JArray.Parse(jsonString);

            var employeeTotals = jsonArray
                .GroupBy(e => e["EmployeeName"]?.ToString() ?? "Unknown")
                .Select(g => new Employee
                {
                    EmployeeName = g.Key,
                    TotalTimeWorked = g.Sum(x =>
                    {
                        var start = x["StarTimeUtc"]?.ToObject<DateTime>();
                        var end = x["EndTimeUtc"]?.ToObject<DateTime>();
                        return (start != null && end != null) ? (end.Value - start.Value).TotalHours : 0;
                    })
                })
                .OrderByDescending(e => e.TotalTimeWorked)
                .ToList();

            var filePath = await GeneratePieChart(employeeTotals);

            var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(bytes, "image/png");
        }

        
        private async Task<string> GeneratePieChart(List<Employee> employeeTotals)
        {
            var chart = new Chart
            {
                Width = 800,
                Height = 600,
                BackColor = Color.White
            };

            chart.ChartAreas.Add(new ChartArea("Main"));
            var series = new Series("Employees")
            {
                ChartType = SeriesChartType.Pie
            };

            foreach (var emp in employeeTotals)
            {
                series.Points.AddXY(emp.EmployeeName, emp.TotalTimeWorked);
            }

            chart.Series.Add(series);

            chart.Palette = ChartColorPalette.BrightPastel;
            series["PieLabelStyle"] = "Outside";
            series["PieDrawingStyle"] = "SoftEdge";

            foreach (var p in series.Points)
            {
                p.Label = "#PERCENT";
                p.LegendText = "#VALX";
            }

            chart.Legends.Add(new Legend("Legend"));

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "employeeChart.png");
            chart.SaveImage(filePath, ChartImageFormat.Png);

            return await Task.FromResult(filePath);
        }
    }
}
