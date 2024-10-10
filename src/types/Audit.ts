export interface IAudit {
  id: string;
  table: string;
  projectId: string;
  column: string;
  oldValue: string;
  newValue: string;
  modifiedBy: string;
  modifiedAt: string;
  reason: string;
  modificationType: string;
}
