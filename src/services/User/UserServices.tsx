import axios from "axios";
import { AssignHabilitationProps } from "../../types/user";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// ASIGN HABILITATION TO USER
export const assignHabilitations = async (
  userHabData: AssignHabilitationProps
) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/User/assign-habilitations`,
      userHabData
    );
    console.log(`Habilitations assigned successfully: ${response.data}`);
  } catch (error) {
    console.error(`error service assign habilitation: ${error}`);
  }
};

// ACTUALISE USER DATA
export const actualiseUserData = async () => {
  try {
    const response = await axios.post(`${endPoint}/api/User/Actualize`);
    return response;
  } catch (error) {
    console.error(`Error while actualising user data: ${error}`);
  }
};

/* ======= GET ======= */

// GET ALL USERS
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/User/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching users`);
  }
};

// GET ALL DEPARTMENTS
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/User/departments`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching department list`);
  }
};

// get user habiliation
export const getUserHabilitations = async (userId: string) => {
  try {
    const response = await axios.get(
      `${endPoint}/api/User/habilitation/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error at fetching user habilitation list`);
  }
};
