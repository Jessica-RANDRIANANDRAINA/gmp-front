import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// login
export const login = async (userCredentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${endPoint}/api/Login`, userCredentials);
    console.log(`Connection success: ${response.data.message}`);
    return response.data.message;
  } catch (error) {
    console.error(`Error while login ${error}`);
  }
};
