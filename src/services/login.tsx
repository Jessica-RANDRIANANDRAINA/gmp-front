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
        localStorage.setItem("_au", response.data.token);
        login(response.data.user);
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
