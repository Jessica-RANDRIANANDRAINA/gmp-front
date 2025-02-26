import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// GET
// get all activities of the given user
export const getAllActivitiesOfUser = async (
  startDate?: string,
  endDate?: string,
  activityType?: string[],
  ids?: (string | undefined)[]
) => {
  try {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (activityType) {
      activityType.forEach((type, index) => {
        params[`ActivityType[${index}]`] = type;
      });
    }
    if (ids) {
      ids.forEach((id, index) => {
        params[`Ids[${index}]`] = id;
      });
    }

    const response = await axios.get(`${endPoint}/api/Activity/all`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Error at get all activities of a given user services: ${error}`
    );
  }
};

// get all transverse related to one user
export const getTransverseByUserId = async (userid: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Activity/transverse/${userid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at get transverses of an user services: ${error}`);
  }
};

// get all intercontract related to one user
export const getInterContractByUserId = async (userid: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Activity/intercontract/${userid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at get intercontract of an user services: ${error}`);
  }
};
// get all task project activity related to one user
export const getTaskActivityByUserId = async (userid: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/Activity/project/${userid}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at get task activity of an user services: ${error}`);
  }
};

// get all activities stat
export const getActivitiesStat = async (
  startDate?: string,
  endDate?: string,
  ids?: (string | undefined)[]
) => {
  try {
    
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (ids) {
      ids.forEach((id, index)=>{
        params[`Ids[${index}]`] = id;
      })
    }
  
    const response = await axios.get(`${endPoint}/api/Activity/stat`, {
      params
    })
    return response.data
  } catch (error) {
    throw new Error(
      `Error at get STAT of a given user services: ${error}`
    );
  }
};

// POST
// create a new transverse task
export const createTransverse = async (transverseData: any) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Activity/transverse/create`,
      transverseData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at create transverse service : , ${error}`);
  }
};
// create a new intercontract
export const createInterContract = async (intercontractData: any) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Activity/intercontract/create`,
      intercontractData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at create intercontract service : , ${error}`);
  }
};
// create a new task project activity
export const createTaskActivity = async (taskActivityData: any) => {
  try {
    const response = await axios.post(
      `
      ${endPoint}/api/Activity/project/create`,
      taskActivityData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at create task activity service : , ${error}`);
  }
};

// PUT
// update transverse
export const updateTransverse = async (
  transverseId: string,
  transverseData: any
) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Activity/transverse/update/${transverseId}`,
      transverseData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update transverse: ${error}`);
  }
};
// update intercontract
export const updateIntercontract = async (
  intercontractId: string,
  intercontractData: any
) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Activity/intercontract/update/${intercontractId}`,
      intercontractData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update intercontract: ${error}`);
  }
};
// update task activity
export const updateTaskActicity = async (
  taskActivityId: string,
  taskActivityData: any
) => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Activity/project/update/${taskActivityId}`,
      taskActivityData
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at update task activity: ${error}`);
  }
};

// DELETE
// delete transverse
export const deleteTransverse = async (transverseId: string) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/Activity/transverse/delete/${transverseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at delete transverse project: ${error}`);
  }
};
// delete intercontract
export const deleteIntercontract = async (intercontractId: string) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/Activity/intercontract/delete/${intercontractId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at delete intercontract project: ${error}`);
  }
};
// delete intercontract
export const deleteTaskActivity = async (taskActivityId: string) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/Activity/project/delete/${taskActivityId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at delete task activity project: ${error}`);
  }
};

// initialize space ranking
export const initializeSpaceRanking = async () => {
  try {
    const response = await axios.put(
      `${endPoint}/api/Activity/rank/initialize/`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at initialize space ranking activity: ${error}`);
  }
};
