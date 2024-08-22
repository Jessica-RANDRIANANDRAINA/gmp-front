import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// GET
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${endPoint}/User/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching users`);
  }
};

export const getAllDepatments = async () => {
  try {
    const response = await axios.get(`${endPoint}/User/departments`)
    return response.data
  } catch (error) {
    throw new Error(`Error at fetching department list`)
  }
}
