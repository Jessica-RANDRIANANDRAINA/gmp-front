import axios from "axios";
import { HabilitationDataProps } from "../../types/Habilitation";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// POST
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
    console.error(`Error creating habilitation: ${error}`);
  }
};
