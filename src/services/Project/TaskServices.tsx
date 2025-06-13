import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;


// Configuration commune pour les requêtes avec fichiers
const fileUploadConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
};

// ===== FILE UPLOAD ===== //
export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${endPoint}/api/Task/upload`,
      formData,
      fileUploadConfig
    );

    return response.data;
  } catch (error) {
    throw new Error(`Error uploading file: ${error}`);
  }
};
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
export const getTaskDetails = async (activityId: string) => {
  try {
    const response = await axios.get(`${endPoint}/api/Task/details/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

// ===== GET ===== //
export const getTransverseDetails = async (activityId: string) => {
  try {
    const response = await axios.get(`${endPoint}/api/Task/transverse/details/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transverse details:', error);
    throw error;
  }
};

// ===== GET ===== //
export const getIntercontractDetails = async (activityId: string) => {
  try {
    const response = await axios.get(`${endPoint}/api/Task/intercontract/details/${activityId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching intercontract details:', error);
    throw error;
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

// ===== DELETE ===== //
// delete a task
export const deletetaskProject = async (taskId: string) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/task/delete/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at delete task project: ${error}`);
  }
};

