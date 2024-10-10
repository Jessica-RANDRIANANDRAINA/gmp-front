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

        // TO DO
        return habilitation.habilitations;
      }
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }
};
