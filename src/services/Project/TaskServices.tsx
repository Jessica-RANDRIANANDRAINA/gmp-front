// ✅ TaskServices.tsx — version corrigée et stable
import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ======================================================
// ⚙️ Helper universel pour gérer les réponses vides et statuts 204/200
// ======================================================
const safeRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config: any = {}
) => {
  try {
    const res = await axios({
      method,
      url,
      data,
      validateStatus: () => true, // ✅ Tolère 204/200 même sans JSON
      ...config,
    });

    if (res.status >= 200 && res.status < 300) {
      // Tolère les réponses texte / vides
      return typeof res.data === "object" ? res.data || {} : { message: res.data };
    }

    console.error(`❌ Erreur HTTP ${res.status} sur ${url}`);
    throw new Error(`Erreur HTTP ${res.status}`);
  } catch (err) {
    console.error(`⚠️ Axios error sur ${url} :`, err);
    throw err;
  }
};

// ======================================================
// 🗂️ Configuration commune pour upload
// ======================================================
const fileUploadConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
};

// ======================================================
// 📤 FILE UPLOAD
// ======================================================
export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    return await safeRequest("post", `${endPoint}/api/Task/upload`, formData, fileUploadConfig);
  } catch (error) {
    console.error("❌ Erreur upload fichier:", error);
    throw new Error(`Error uploading file: ${error}`);
  }
};

// ======================================================
// ➕ CREATE
// ======================================================
export const createTaskPhase = async (taskData: any) => {
  return await safeRequest("post", `${endPoint}/api/Task/create`, taskData);
};

// ======================================================
// 🔍 GET
// ======================================================
export const getTaskDetails = async (activityId: string) => {
  return await safeRequest("get", `${endPoint}/api/Task/details/${activityId}`);
};

export const getTransverseDetails = async (activityId: string) => {
  return await safeRequest("get", `${endPoint}/api/Task/transverse/details/${activityId}`);
};

export const getIntercontractDetails = async (activityId: string) => {
  return await safeRequest("get", `${endPoint}/api/Task/intercontract/details/${activityId}`);
};

export const getTaskByProjectAndPhaseID = async (projectId: string, phaseId: string) => {
  return await safeRequest("get", `${endPoint}/api/Task/project/${projectId}/${phaseId}`);
};

// ======================================================
// 🔄 UPDATE
// ======================================================
export const updateTaskProject = async (taskId: string, taskData: any) => {
  return await safeRequest("put", `${endPoint}/api/Task/update/${taskId}`, taskData);
};

// ======================================================
// 🗑️ DELETE
// ======================================================
export const deletetaskProject = async (taskId: string) => {
  return await safeRequest("delete", `${endPoint}/api/Task/delete/${taskId}`);
};

// ======================================================
// ✅ Logging utilitaires
// ======================================================
export const logSuccess = (action: string, id?: string) => {
  console.log(`✅ ${action} réussi${id ? ` pour ${id}` : ""}`);
};

export const logError = (action: string, err: any) => {
  console.error(`❌ Erreur lors de ${action}:`, err);
};
