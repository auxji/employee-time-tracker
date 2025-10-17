using Microsoft.AspNetCore.Mvc;
using EmployeeWorkTime.Models;
using Newtonsoft.Json.Linq;

namespace EmployeeWorkTime.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly HttpClient _httpClient;

        public EmployeeController()
        {
            _httpClient = new HttpClient();
        }

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
                    // Taking the last entry's action just as example (can adjust later)
                    EntryNotes = g.Last()["EntryNotes"]?.ToString()
                })
                .OrderByDescending(e => e.TotalTimeWorked)
                .ToList();

            return View(employeeTotals);
        }
    }
}
