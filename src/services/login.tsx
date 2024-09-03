import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { HabilitationAdminInterface } from "../types/Habilitation";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// login
export const useAuthService = () => {
  const { login } = useAuth();
  const loginUser = async (userCredentials: {
    username: string;
    password: string;
    type: string;
  }) => {
    try {
      const response = await axios.post(
        `${endPoint}/api/Login`,
        userCredentials,
        { withCredentials: true }
      );

      if (response.data && response.data.type === "success") {
        let adminPrivilege = false;
        const habilitation = response.data.user.habilitations;
        habilitation?.forEach(
          (hab: { habilitationAdmins: HabilitationAdminInterface[] }) => {
            hab.habilitationAdmins.forEach(
              (admin: HabilitationAdminInterface) => {
                if (
                  admin?.createHabilitation === 1 ||
                  admin?.deleteHabilitation === 1 ||
                  admin?.modifyHierarchy === 1 ||
                  admin?.restoreHierarchy === 1 ||
                  admin?.updateHabilitation === 1
                ) {
                  adminPrivilege = true;
                }
              }
            );
          }
        );

        if (adminPrivilege && userCredentials.type === "admin") {
          localStorage.setItem("_au_ad", response.data.token);

          login(response.data.user);
        } else if (adminPrivilege && userCredentials.type === "project") {
          localStorage.setItem("_au_pr", response.data.token);

          login(response.data.user);
        } else {
          return {
            message: "Vous n'avez pas accèss à cette plateforme",
            type: "error",
          };
        }
      }

      return response.data;
    } catch (error) {
      console.error(`Error while login ${error}`);
    }
  };

  return { loginUser };
};

//logout

export const logout = async () => {
  try {
    const response = await axios.post(`${endPoint}/api/Login/logout`);
    localStorage.removeItem("_au_ad");
    localStorage.removeItem("_au_pr");
    return response;
  } catch (error) {
    console.error(`Error while logout service ${error}`);
  }
};
