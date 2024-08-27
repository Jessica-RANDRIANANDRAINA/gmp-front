export interface TableAccessProps {
  data: Array<{
    id: string;
    label: string;
    habilitationAdmins: {
      createHabilitation: number;
      deleteHabilitation: number;
      updateHabilitation: number;
      modifyHierarchy: number;
      restoreHierarchy: number;
    }[];
    habilitationProjects: {
      create: number,
      update: number,
      delete: number,
      assign: number,
    }[];
    habilitationTransverses: {
      create: number,
      update: number,
      delete: number,
    }[];
    habilitationIntercontracts: {
      create: number,
      update: number,
      delete: number,
    }[];
  }>;
}
