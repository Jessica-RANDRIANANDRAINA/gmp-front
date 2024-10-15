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
};
