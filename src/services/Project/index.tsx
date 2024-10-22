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
} from "./TaskServices";

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
};
