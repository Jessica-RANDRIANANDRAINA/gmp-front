export interface IAudit {
  pageNumber: number;
  pageSize: number;
  totalHistoric: number;
  historic: IHistoric[];
}
interface IHistoric {
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
