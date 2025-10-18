

 Kako bi generisala pie-chart koristila sam se bibliotekom koja ima dependency na Windows, iz tog razloga radi samo na Windows-u

---

## Zahtevi:
-  Unutar .csproj fajla nalazi se 
```bash
<PropertyGroup>
  <TargetFramework>net8.0-windows</TargetFramework>
  <UseWindowsForms>true</UseWindowsForms>
  <EnableWindowsTargeting>true</EnableWindowsTargeting>
</PropertyGroup>

```
- zato su neophodne sledece komande prilikom pokretanja

```bash
dotnet add package System.Windows.Forms.DataVisualization --prerelease
dotnet add package System.Data.SqlClient

dotnet restore
dotnet build
dotnet run
