import axios from "axios";
import { IProjectDto } from "../../types/Project";

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
// get project by user id
export const getProjectByUserId = async (userid: string | undefined) => {
  try {
    const response = await axios.get(`${endPoint}/api/Project/user/${userid}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching project by user id service: ${error}`);
  }
};

// get project by user id (project related to the user and all his subordinates)
export const getAllLevelProjectByUserId = async (
  userid: string | undefined
) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Project/user/${userid}/all-level`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error at fetching all level project by user id service: ${error}`
    );
  }
};

//get project by project id
export const getProjectById = async (projectid: string) => {
  try {
    const response = await axios.get(`${endPoint}/api/Project/${projectid}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching project by id service: ${error}`);
  }
};

export const getProjectByIDs = async (projectid: Array<string>) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Project/by-ids`,
      projectid
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error at get project by ids services: ${error}`);
  }
};

// ===== POST =======
// create a new project
export const createProject = async (projectData: IProjectDto) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Project/create`,
      projectData
    );
    return response;
  } catch (error) {
    throw new Error(`Error at create new project services: ${error}`);
  }
};

// ===== PUT ===== //
// update a given project
export const updateProject = async (
  projectId: string,
  projectData: IProjectDto
) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Project/update/${projectId}`,
      projectData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update project services: ${error}`);
  }
};

// archive project(s)
export const archiveProject = async (ids: Array<string>) => {
  try {
    const response = await axios.put(`${endPoint}/api/Project/archives`, ids);
    if (response.status === 200) {
      return {
        state: "success",
        message: "Archive project success",
      };
    } else {
      return {
        state: "error",
        message: "something went wrong",
      };
    }
  } catch (error) {
    console.error(`An error occured while archiving projects: ${error}`);

    throw error;
  }
};
