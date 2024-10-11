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
      actualizeUserData: number;
      assignAccess: number;
    }[];
    habilitationProjects: {
      assign: number;
      create: number;
      update: number;
      updateMySubordinatesProject: number;
      delete: number;
      deleteMySubordinatesProject: number;
      watchMyProject: number;
      watchMySubordinatesProject: number;
      manage: number;
      manageMySubordinatesProject: number;
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
  }>;
}
