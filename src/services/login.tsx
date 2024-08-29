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
      console.log(userCredentials)
      const response = await axios.post(
        `${endPoint}/api/Login`,
        userCredentials, 
        {withCredentials: true}
      );
     

      if (response.data && response.data.type === "success") {
        console.log("----CONTEXT-------");
        console.log(response.data.user);
        console.log("----CONTEXT-------");
        login(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error(`Error while login ${error}`);
    }
  };

  return { loginUser };
};
