export interface TimeEntry {
  Id: number;
  EmployeeName: string;
  StarTimeUtc: string; // yes, the API uses "StarTimeUtc"
  EndTimeUtc: string;
  EntryNotes?: string | null;
  DeletedOn?: string | null;
}
