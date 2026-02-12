import axios from "axios";
const endPoint = import.meta.env.VITE_API_ENDPOINT;

// === Récupérer tous les commentaires ===
export const fetchComments = async (activityId: string, type: string) => {
  const res = await axios.get(`${endPoint}/api/Comment/${type.toLowerCase()}/${activityId}`);
  return res.data;
};

// === Ajouter un commentaire ===
export const postComment = async (payload: {
  userId: string;
  content: string;
  taskId?: string;
  intercontractId?: string;
  transverseId?: string;
  parentCommentId?: string | null;
}) => {
  const res = await axios.post(`${endPoint}/api/Comment/add`, payload);
  return res.data;
};

// === Ajouter une réponse ===
export const postReply = async (payload: {
  userId: string;
  content: string;
  commentId: string;
}) => {
  const res = await axios.post(`${endPoint}/api/Comment/reply`, payload);
  return res.data;
};
