import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// GET
// get all activities of the given user
export const getAllActivitiesOfUser = async (userid: string) => {
  try {
    const response = await axios.get(`${endPoint}/api/Activity/all/${userid}`);
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

// POST
// create a new transverse task
export const createTransverse = async (transverseData: any) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Activity/transverse/create`,
      transverseData
    );
    return response;
  } catch (error) {
    throw new Error(`Error at create transverse service : , ${error}`);
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
