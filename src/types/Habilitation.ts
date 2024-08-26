export interface HabilitationDataProps {
  id: string;
  label: string;
  habilitationAdmins: {
    modifyHierarchy: number;
    createHabilitation: number;
    updateHabilitation: number;
    deleteHabilitation: number;
    restoreHierarchy: number;
  }[];
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
