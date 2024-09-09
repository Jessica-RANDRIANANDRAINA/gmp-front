import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// get all projects
export const getAllProject = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Project/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching project`);
  }
};
