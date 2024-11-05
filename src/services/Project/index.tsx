import { getHistoricByProjectId } from "./Audit";
import {
  getAllProject,
  getProjectByUserId,
  getAllLevelProjectByUserId,
  getProjectById,
  getProjectByIDs,
  createProject,
  updateProject,
  archiveProject,
  updateAdvancementProject,
  updateTeamProject,
  getPhaseById,
  updatePhaseSettings,
} from "./ProjectServices";

import {
  createTaskPhase,
  getTaskByProjectAndPhaseID,
  updateTaskProject,
  deletetaskProject,
} from "./TaskServices";

import {
  getAllActivitiesOfUser,
  getTransverseByUserId,
  getInterContractByUserId,
  createTransverse,
  updateTransverse,
  deleteTransverse,
  createInterContract,
  updateIntercontract,
  deleteIntercontract,
} from "./Activities";

export {
  getAllProject,
  getProjectByUserId,
  getAllLevelProjectByUserId,
  getProjectById,
  getProjectByIDs,
  createProject,
  updateProject,
  archiveProject,
  updateAdvancementProject,
  getHistoricByProjectId,
  updateTeamProject,
  getPhaseById,
  updatePhaseSettings,
  createTaskPhase,
  getTaskByProjectAndPhaseID,
  updateTaskProject,
  deletetaskProject,
  getAllActivitiesOfUser,
  getTransverseByUserId,
  getInterContractByUserId,
  createTransverse,
  updateTransverse,
  deleteTransverse,
  createInterContract,
  updateIntercontract,
  deleteIntercontract,
};
