import axios from "axios";
import { ProjectDtoInterface } from "../../types/Project";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ======GET========
// get all projects
export const getAllProject = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Project/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching project`);
  }
};

// ===== POST =======
// create a new project
export const createProject = async (projectData: ProjectDtoInterface) => {
  try {
    console.log(projectData);
    const response = await axios.post(
      `${endPoint}/api/Project/create`,
      projectData
    );
    return response;
  } catch (error) {
    throw new Error(`Error at create new project services: ${error}`);
  }
};
