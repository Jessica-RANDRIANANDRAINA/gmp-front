import axios from "axios";
import { useAuth } from "../context/AuthContext";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// login
export const useAuthService = () => {
  const { login } = useAuth();
  const loginUser = async (userCredentials: {
    username: string;
    password: string;
  }) => {
    try {
      console.log(userCredentials);
      const response = await axios.post(
        `${endPoint}/api/Login`,
        userCredentials,
        { withCredentials: true }
      );

      if (response.data && response.data.type === "success") {
        let adminPrivilege = false;
        const habilitation = response.data.user.habilitations;
        habilitation?.forEach((hab) => {
          hab.habilitationAdmins.forEach((admin) => {
            if (
              admin?.createHabilitation === 1 ||
              admin?.deleteHabilitation === 1 ||
              admin?.modifyHierarchy === 1 ||
              admin?.restoreHierarchy === 1 ||
              admin?.updateHabilitation === 1
            ) {
              adminPrivilege = true;
            } 
          });
        });

        if(adminPrivilege){

          localStorage.setItem("_au", response.data.token);
  
          login(response.data.user);
        }else {
          return {message: "Vous n'avez pas accèss à cette plateforme", type: "error"}
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
    localStorage.removeItem("_au");
    return response;
  } catch (error) {
    console.error(`Error while logout service ${error}`);
  }
};
