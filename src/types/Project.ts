export interface ProjectData {
  id: string;
  title: string;
  description: string;
  priority: string;
  beneficiary: string;
  initiator: string;
  startDate?: string;
  endDate?: string;
  listBudgets: BudgetInterface[];
  listRessources: RessourceInterface[];
  listPhases: PhaseInterface[];
  listUsers: UserProjectInterface[];
  codeBuget: string;
  directionSourceBudget: string;
  budgetAmount: number;
  budgetCurrency: string;
}

export interface ProjectDtoInterface {
  id: string;
  title: string;
  description: string;
  priority: string;
  beneficiary: string;
  initiator: string | undefined;
  startDate?: string;
  endDate?: string;
  listBudgets: BudgetInterface[];
  listRessources: RessourceInterface[];
  listPhases: PhaseInterface[];
  listUsers: UserProjectInterface[];
}
export interface PhaseInterface {
  id?: number;
  rank?: number;
  phase1: string;
  expectedDeliverable: string;
}
export interface RessourceInterface {
  id: string;
  source: string;
  type: string;
  ressource: string;
}

export interface BudgetInterface {
  code: string;
  direction: string;
  amount: number;
  currency: string;
}

export interface UserProjectInterface {
  userid: string | undefined;
  projectid: string;
  role: string;
}
