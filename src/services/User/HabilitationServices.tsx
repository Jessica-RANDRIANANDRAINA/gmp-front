import axios from "axios";
import { HabilitationDataProps } from "../../types/Habilitation";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ========= GET ========= */
// GET ALL HABILITATION
export const getAllHabilitation = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Habilitation/all`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at service fetching habilitation`);
  }
};

// get all habilitation labels
export const getAllHabilitationLabels = async () => {
  try {
    const response = await axios.get(`${endPoint}/api/Habilitation/labels`);
    return response.data;
  } catch (error) {
    throw new Error(`Error at service fetching habilitation labels`);
  }
};

/* ========= POST ========= */
// CREATE HABILITATION
export const createHabilitation = async (
  habilitationdata: HabilitationDataProps
) => {
  try {
    const response = await axios.post(
      `${endPoint}/api/Habilitation/create`,
      habilitationdata
    );
    console.log(`Hablilitation created: ${response.data}`);
  } catch (error) {
    console.error(`Error service creating habilitation: ${error}`);
  }
};

// DELETE HABILITATION
export const deleteHabilitation = async (ids: string[]) => {
  try {
    const response = await axios.delete(
      `${endPoint}/api/Habilitation/deletes`,
      {
        data: ids,
      }
    );

    if (response.status === 200) {
      console.log(`Habilitations was been deleted successfully`);
    } else {
      console.log(`Failed to delete the habilitation`);
    }
  } catch (error) {
    console.error(`An error occured while deleting the habilitation: ${error}`);
  }
};
