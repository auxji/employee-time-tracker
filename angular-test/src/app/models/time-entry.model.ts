export interface TimeEntry {
  Id: number;
  EmployeeName: string;
  StarTimeUtc: string; 
  EndTimeUtc: string;
  EntryNotes?: string | null;
  DeletedOn?: string | null;
}
