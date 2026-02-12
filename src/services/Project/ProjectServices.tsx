// ✅ ProjectServices.tsx — version corrigée et stable
import axios from "axios";
import { IProjectDto } from "../../types/Project";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// ======================================================
// ⚙️ Helper universel : gère les réponses vides et erreurs 204
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
      validateStatus: () => true, // ✅ évite l’erreur Axios sur 204 / 200 sans JSON
      ...config,
    });

    if (res.status >= 200 && res.status < 300) {
      // Tolère les réponses vides ou texte
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
// 🔹 GETTERS
// ======================================================

export const getAllProject = async (
  pageNumber?: number,
  pageSize?: number,
  title?: string,
  member?: string[],
  priority?: string,
  criticity?: string,
  completionPercentage?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = { pageNumber, pageSize };
  if (title) params.title = title;
  if (member)
    member.forEach((user, index) => (params[`Members[${index}]`] = user));
  if (priority) params.priority = priority;
  if (criticity) params.criticity = criticity;
  if (completionPercentage) params.completionPercentage = completionPercentage;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return await safeRequest("get", `${endPoint}/api/Project/all`, undefined, { params });
};

export const getProjectByUserId = async (userid: string | undefined) => {
  return await safeRequest("get", `${endPoint}/api/Project/user/${userid}`);
};

export const getAllArchivedProjects = async (
  pageNumber?: number,
  pageSize?: number,
  title?: string,
  members?: string[],
  priority?: string,
  criticity?: string,
  completionPercentage?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = { pageNumber, pageSize };
  if (title) params.title = title;
  if (members)
    members.forEach((user, index) => (params[`Members[${index}]`] = user));
  if (priority) params.priority = priority;
  if (criticity) params.criticity = criticity;
  if (completionPercentage) params.completionPercentage = completionPercentage;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return await safeRequest("get", `${endPoint}/api/Project/allarchived`, undefined, { params });
};

export const getAllCompletedProjects = async (
  pageNumber?: number,
  pageSize?: number,
  title?: string,
  members?: string[],
  priority?: string,
  criticity?: string,
  completionPercentage?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = { pageNumber, pageSize };
  if (title) params.title = title;
  if (members)
    members.forEach((user, index) => (params[`Members[${index}]`] = user));
  if (priority) params.priority = priority;
  if (criticity) params.criticity = criticity;
  if (completionPercentage) params.completionPercentage = completionPercentage;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return await safeRequest("get", `${endPoint}/api/Project/allcomplete`, undefined, { params });
};

export const getAllLevelProjectByUserId = async (
  userid: string | undefined,
  pageNumber?: number,
  pageSize?: number,
  title?: string,
  member?: string[],
  priority?: string,
  criticity?: string,
  completionPercentage?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = { pageNumber, pageSize };
  if (title) params.title = title;
  if (member)
    member.forEach((user, index) => (params[`Members[${index}]`] = user));
  if (priority) params.priority = priority;
  if (criticity) params.criticity = criticity;
  if (completionPercentage) params.completionPercentage = completionPercentage;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return await safeRequest(
    "get",
    `${endPoint}/api/Project/user/${userid}/all-level`,
    undefined,
    { params }
  );
};

export const getCountProject = async (userid: string | undefined) => {
  return await safeRequest("get", `${endPoint}/api/Project/count/${userid}`);
};

export const getProjectById = async (projectid: string) => {
  return await safeRequest("get", `${endPoint}/api/Project/${projectid}`);
};

export const getProjectByIDs = async (projectid: Array<string>) => {
  return await safeRequest("post", `${endPoint}/api/Project/by-ids`, projectid);
};

export const getPhaseById = async (phaseId: string) => {
  return await safeRequest("get", `${endPoint}/api/Project/phase/${phaseId}`);
};

export const getProjectStat = async (
  startDate?: string,
  endDate?: string,
  ids?: (string | undefined)[]
) => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (ids) ids.forEach((id, index) => (params[`Ids[${index}]`] = id));
  return await safeRequest("get", `${endPoint}/api/Project/stat`, undefined, { params });
};
export type ChefProjet = {
  id: string;
  name: string;
  email: string;
};

export const getAllChefsProjet = async (): Promise<ChefProjet[]> => {
  const res = await axios.get(`${endPoint}/api/Project/chefs`);
  return res.data;
};
// ======================================================
// 🔹 POST / PUT / DELETE
// ======================================================

// ➕ Create
export const createProject = async (projectData: IProjectDto) => {
  return await safeRequest("post", `${endPoint}/api/Project/create`, projectData);
};

// 🔄 Update
export const updateProject = async (projectId: string, projectData: IProjectDto) => {
  return await safeRequest("put", `${endPoint}/api/Project/update/${projectId}`, projectData);
};

export const updateAdvancementProject = async (
  projectId: string,
  advancement: number,
  name: string | undefined
) => {
  return await safeRequest("put", `${endPoint}/api/Project/update-advancement/${projectId}`, {
    advancement,
    changementInitiator: name,
  });
};

export const updateProjectState = async (
  projectId: string,
  state: string,
  name: string | undefined
) => {
  return await safeRequest("put", `${endPoint}/api/Project/update/state/${projectId}`, {
    state,
    initiator: name,
  });
};

export const archiveProject = async (ids: Array<string>, initiator: string) => {
  return await safeRequest("put", `${endPoint}/api/Project/archives`, { ids, initiator });
};

export const updateTeamProject = async (projectId: string, data: any) => {
  return await safeRequest("put", `${endPoint}/api/Project/update/team/${projectId}`, data);
};

export const updatePhaseSettings = async (phaseId: string, data: any) => {
  return await safeRequest("put", `${endPoint}/api/Project/phase/${phaseId}`, data);
};

// ======================================================
// ✅ Logging helpers (optionnels)
// ======================================================

export const logSuccess = (action: string, id?: string) => {
  console.log(`✅ ${action} réussi${id ? ` pour ${id}` : ""}`);
};

export const logError = (action: string, err: any) => {
  console.error(`❌ Erreur lors de ${action}:`, err);
};
