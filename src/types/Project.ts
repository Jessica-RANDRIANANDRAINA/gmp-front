export interface IProjectData {
  id: string;
  title: string;
  description: string;
  priority: string;
  beneficiary: string;
  initiator: string;
  isEndDateImmuable?: boolean;
  completionPercentage?: number;
  startDate?: string;
  endDate?: string;
  listBudgets: IBudget[];
  listRessources: IRessource[];
  listPhases: IPhase[];
  listUsers: IUserProject[];
  listHistoricProjects?: IHistoricProject[];
  idBudget?: string;
  codeBuget: string;
  directionSourceBudget: string;
  budgetAmount: number | null;
  budgetCurrency: string;
}

export interface IProjectDto {
  id: string;
  title: string;
  description: string;
  priority: string;
  beneficiary: string;
  initiator: string | undefined;
  startDate?: string;
  endDate?: string;
  listBudgets: IBudget[];
  listRessources: IRessource[];
  listPhases: IPhase[];
  listUsers: IUserProject[];
  listHistoricProjects?: IHistoricProject[];
}

export interface IHistoricProject {
  id: String;
  initiator: String | undefined;
  elementChanged: String;
  from: String;
  to: String | undefined;
  reason: String;
}
export interface IPhase {
  id?: string;
  rank?: number;
  phase1: string;
  expectedDeliverable: string;
  startDate?: string;
  endDate?: string;
}
export interface IRessource {
  id: string;
  source: string;
  type: string;
  ressource: string;
}

export interface IBudget {
  id?: string;
  code: string;
  direction: string;
  amount: number;
  currency: string;
}

export interface IUserProject {
  userid: string | undefined;
  projectid: string;
  role: string;
}
