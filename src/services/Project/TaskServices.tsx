import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ===== POST =====
// create a ne task in phase
export const createTaskPhase = async (taskData: any) => {
  try {
    const response = await axios.post(`${endPoint}/api/Task/create`, taskData);
    return response;
  } catch (error) {
    throw new Error(`Error at create new task phase services: ${error}`);
  }
};
