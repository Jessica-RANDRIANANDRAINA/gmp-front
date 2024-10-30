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
