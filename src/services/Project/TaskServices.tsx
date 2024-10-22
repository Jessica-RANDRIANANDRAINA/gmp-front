import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ===== POST ===== //
// create a ne task in phase
export const createTaskPhase = async (taskData: any) => {
  try {
    const response = await axios.post(`${endPoint}/api/Task/create`, taskData);
    return response;
  } catch (error) {
    throw new Error(`Error at create new task phase services: ${error}`);
  }
};

// ===== GET ===== //
// get all task by project and by phase
export const getTaskByProjectAndPhaseID = async (
  projectId: string,
  phaseId: string
) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Task/project/${projectId}/${phaseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at get task by project and phase id: ${error}`);
  }
};

// ===== PUT ===== //
// update task
export const updateTaskProject = async (taskId: string, taskData: any) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Task/update/${taskId}`,
      taskData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update task project: ${error}`);
  }
};
