import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TimeEntry } from '../models/time-entry.model';
import { EmployeeAggregate } from '../models/employee-aggregate.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch raw time entries from the API.
   */
  getTimeEntries(): Observable<TimeEntry[]> {
    const params = new HttpParams().set('code', environment.timeEntriesKey);
    return this.http.get<TimeEntry[]>(environment.timeEntriesUrl, { params });
  }

  /**
   * Aggregate entries by employee and compute total hours.
   * Also sorts DESC by totalHours (largest to smallest).
   */
  getEmployeesByTotalHours(): Observable<EmployeeAggregate[]> {
    return this.getTimeEntries().pipe(
      map((entries) => {
        const totals = new Map<string, number>();

        for (const e of entries) {
          if (!e.EmployeeName) continue;
          // some entries may be deleted or have null EndTime; ignore safely
          if (e.DeletedOn) continue;
          if (!e.StarTimeUtc || !e.EndTimeUtc) continue;

          const start = new Date(e.StarTimeUtc).getTime();
          const end = new Date(e.EndTimeUtc).getTime();
          if (isNaN(start) || isNaN(end) || end <= start) continue;

          const hours = (end - start) / (1000 * 60 * 60);
          totals.set(e.EmployeeName, (totals.get(e.EmployeeName) ?? 0) + hours);
        }

        const list: EmployeeAggregate[] = Array.from(totals.entries()).map(
          ([name, totalHours]) => ({ name, totalHours: +totalHours.toFixed(2) })
        );

        return list.sort((a, b) => b.totalHours - a.totalHours);
      })
    );
  }
}
