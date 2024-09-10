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
  initiator: string;
  startDate?: string;
  endDate?: string;
  listBudgets: BudgetInterface[];
  listRessources: RessourceInterface[];
  listPhases: PhaseInterface[];
}
export interface PhaseInterface {
  id?: string;
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
