export interface HabilitationDataProps {
  id: string;
  label: string;
  habilitationAdmins: HabilitationAdminInterface[];
  habilitationProjects: {
    create: number;
    update: number;
    delete: number;
    assign: number;
  }[];
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

export interface HabilitationAdminInterface {
  modifyHierarchy: number;
  createHabilitation: number;
  updateHabilitation: number;
  deleteHabilitation: number;
  restoreHierarchy: number;
}
