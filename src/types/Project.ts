export interface IProjectData {
  id: string;
  codeProjet: string | null;
  title: string;
  description: string;
  priority: string;
  criticality: string;
  beneficiary: string;
  initiator: string;
  isEndDateImmuable?: boolean;
  completionPercentage?: number;
  endDateChangeReason?: string;
  startDate?: string;
  endDate?: string;
  listBudgets: IBudget[];
  listRessources: IRessource[];
  listPhases: IPhase[];
  listUsers: IUserProject[];
  idBudget?: string;
  codeBuget: string;
  anneeBudget: string;
  directionSourceBudget: string;
  budgetAmount: number | null;
  budgetCurrency: string;
  state?: string | null;
}

export interface IProjectDto {
  id: string;
  codeProjet: string;
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
  completionPercentage?: number;
}

export interface IPhase {
  id?: string;
  rank?: number;
  phase1?: string | undefined;
  // expectedDeliverable?: string;
  startDate?: string;
  endDate?: string;
  dependantOf?: string;
  initiator?: string;
  status?: string;
  weight?: number;
  progress?: number;
  completionPercentage?: number;
  // deliverable?: string;
  listDeliverables: {
    id: string;
    deliverableName: string;
    expectedDeliverable?: string;
    phaseid?: string;
  }[];
  userProject?: {
    name: string;
    projectid: string;
    role: string;
    userid: string;
  }[];
}
export interface IRessource {
  id: string;
  source: string;
  type: string;
  ressource: string;
}

export interface IBudget {
  id: string;
  code: string;
  anneebudget: string;
  direction: string;
  amount: number;
  currency: string;
}

export interface IUserProject {
  user?: any;
  userid: string | undefined;
  projectid?: string;
  role?: string;
}
export interface IUserTask {
  name?: string;
  email?: string;
  userid: string;
  taskid: string;
}

export interface Iteam {
  id: string | undefined;
  name: string;
  email: string;
  role: string;
}

export interface ITask {
  id: string | undefined;
  title: string;
  description?: string;
  listUsers?: Array<ListuserTask>;
}

interface ListuserTask {
  userid: string;
  taskid: string;
  user?: any;
}

export interface ITaskAdd {
  id?: string;
  title: string;
  description: string;
  type?: string;
  dailyEffort?: number;
  startDate?: string ;
  dueDate?: string;
  fichier?: string;
  projectTitle?: string;
  phaseTitle?: string;
  projectId?: string;
  phaseId?: string;
  transverseType?: string;
  intercontractType?: string;
  status?: string;
  priority?: string;
}

export interface IActivityAdd {
  id?: string;
  title: string;
  description: string;
  type?: string;
  dailyEffort?: number;
  optionalEffort?: number;
  startDate?: string ;
  dueDate?: string;
  endDate?: string;
  fichier?: string ;
  projectTitle?: string;
  phaseTitle?: string;
  projectId?: string;
  phaseId?: string;
  transverseType?: string;
  intercontractType?: string;
  status?: string;
  priority?: string;
  fileName?:string;
  fileContent?: File;
}

export interface ITransverseAdd {
  id?: string;
  title: string;
  description?: string;
  type: string;
  dailyEffort: number;
  startDate?: string;
  endDate?:string;
  status?: string;
}

export interface IActivityStat {
  totalDailyEffortTask: number;
  totalDailyEffortTransverse: number;
  totalDailyEffortIntercontract: number;
  task: ITitleEffort[];
  transverse: ITitleEffort[];
  intercontract: ITitleEffort[];
}
export interface ITitleEffort {
  title?: string;
  totalDailyEffort: number;
}
