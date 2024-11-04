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
