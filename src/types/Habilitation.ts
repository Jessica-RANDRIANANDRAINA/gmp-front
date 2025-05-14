export interface HabilitationDataProps {
  id?: string;
  label: string;
  habilitationAdmins: HabilitationAdminInterface[];
  habilitationProjects: HabilitationProjectInterface[];
  habilitationTransverses: {
    create: number;
    update: number;
    delete: number;
  }[];
  habilitationIntercontracts: {
    create: number;
    update: number;
    delete: number;
  }[];
}

export interface HabilitationProjectInterface {
  create: number;
  update: number;
  delete: number;
  assign: number;
}

export interface HabilitationAdminInterface {
  modifyHierarchy: number;
  createHabilitation: number;
  updateHabilitation: number;
  deleteHabilitation: number;
  restoreHierarchy: number;
  actualizeUserData: number;
  assignAccess: number;
  watchAllActivity: number
}

export interface IMyHabilitation {
  admin: {
    createHabilitation: boolean;
    deleteHabilitation: boolean;
    modifyHierarchy: boolean;
    restoreHierarchy: boolean;
    updateHabilitation: boolean;
    actualizeUserData: boolean;
    assignAccess: boolean;
    watchAllActivity: boolean;
  };
  project: {
    assign: boolean;
    create: boolean;
    delete: boolean;
    update: boolean;
    watchMyProject: boolean;
    watchMySubordinatesProject: boolean;
    updateMySubordinatesProject: boolean;
    deleteMySubordinatesProject: boolean;
    manageMySubordinatesProject: boolean;
    manage: boolean;
  };
  transverse: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  intercontract: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}
