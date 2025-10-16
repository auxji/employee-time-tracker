import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TimeEntry {
  Id: string;
  EmployeeName: string;
  StarTimeUtc: string;
  EndTimeUtc: string;
  EntryNotes?: string;
  DeletedOn?: string | null;
}

export interface EmployeeAggregate {
  name: string;
  totalHours: number;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getTimeEntries(): Observable<TimeEntry[]> {
    const params = new HttpParams().set('code', environment.timeEntriesKey);
    return this.http.get<TimeEntry[]>(environment.timeEntriesUrl, { params });
  }

  
  /**
   * all data
    logRawEntries() {
  this.getTimeEntries().subscribe(entries => {
    console.log('Raw API data:', entries);
  });
}
   */


  getEmployeesByTotalHours(): Observable<EmployeeAggregate[]> {
    return this.getTimeEntries().pipe(
      map(entries => {
        const totals = new Map<string, number>();

        for (const e of entries) {
          if (!e.EmployeeName || e.DeletedOn) continue;
          if (!e.StarTimeUtc || !e.EndTimeUtc) continue;

          const start = new Date(e.StarTimeUtc).getTime();
          const end = new Date(e.EndTimeUtc).getTime();
          if (isNaN(start) || isNaN(end) || end <= start) continue;

          const hours = (end - start) / (1000 * 60 * 60);
          totals.set(e.EmployeeName, (totals.get(e.EmployeeName) ?? 0) + hours);
        }

        return Array.from(totals.entries())
          .map(([name, totalHours]) => ({ name, totalHours: +totalHours.toFixed(2) }))
          .sort((a, b) => b.totalHours - a.totalHours);
      })
    );
  }
}
