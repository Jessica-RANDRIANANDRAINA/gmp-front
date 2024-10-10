import { decodeToken } from "./TokenService";
import { getUserHabilitations } from "../User";

export const getInitials = (fullname: string) => {
  const names = fullname.split(" ");
  const firstInitial = names?.[0] ? names?.[0]?.[0]?.toUpperCase() : "";
  const secondInitial = names?.[1] ? names?.[1]?.[0]?.toUpperCase() : "";

  return `${firstInitial}${secondInitial}`;
};

export const getAllMyHabilitation = async () => {
  const token = localStorage.getItem("_au_pr");
  if (token) {
    try {
      const decoded = decodeToken("pr");

      if (decoded?.jti) {
        const habilitation = await getUserHabilitations(decoded?.jti);

        const transformed = transformHabilitation(habilitation.habilitations);

        return transformed;
      }
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }
};

const transformHabilitation = (habilitations: any[]) => {
  const habilitation = {
    admin: {
      createHabilitation: false,
      deleteHabilitation: false,
      modifyHierarchy: false,
      restoreHierarchy: false,
      updateHabilitation: false,
    },
    project: {
      assign: false,
      create: false,
      delete: false,
      update: false,
    },
  };
  habilitations.forEach(({ habilitationAdmins, habilitationProjects }) => {
    const admin = habilitationAdmins?.[0];
    const project = habilitationProjects?.[0];

    // Admin habilitations: Only update if current value is false and new value is true (1)
    if (admin) {
      habilitation.admin.createHabilitation ||= admin.createHabilitation === 1;
      habilitation.admin.deleteHabilitation ||= admin.deleteHabilitation === 1;
      habilitation.admin.modifyHierarchy ||= admin.modifyHierarchy === 1;
      habilitation.admin.restoreHierarchy ||= admin.restoreHierarchy === 1;
      habilitation.admin.updateHabilitation ||= admin.updateHabilitation === 1;
    }

    // Project habilitations: Same logic as admin
    if (project) {
      habilitation.project.assign ||= project.assign === 1;
      habilitation.project.create ||= project.create === 1;
      habilitation.project.delete ||= project.delete === 1;
      habilitation.project.update ||= project.update === 1;
    }
  });
  return habilitation;
};
