import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ===== GET =====
// get historic by project id
export const getHistoricByProjectId = async (
  projectId: string,
  pageNumber?: number,
  pageSize?: number
) => {
  try {
    const response = await axios.get(`${endPoint}/api/Audit/project`, {
      params: {
        projectid: projectId,
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetchin audit project: ${error}`);
  }
};
