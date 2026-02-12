import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Clock,
  Briefcase,
  BarChart2,
} from "lucide-react";
import { formatDate } from "../../services/Function/DateServices";
import { useNavigate } from "react-router-dom";
import CircularProgress from "../UIElements/CircularProgress";
import { IPhase } from "../../types/Project";

/* ================= TYPES ================= */
type Project = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  title: string;
  completionPercentage: number;
  phases?: IPhase[];
};

type StatCategory = {
  title: string;
  count?: number;
  projects?: Project[];
};

type Props = {
  category: StatCategory;
};

/* ================= COMPONENT ================= */

const ProjectStatsCard = ({ category }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigateDetails = (projectId: string) => {
    navigate(`/gmp/project/details/${projectId}/details`);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl bg-white dark:bg-strokedark shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* ================= HEADER ================= */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600">
            <BarChart2 size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            {category.title}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full">
            {category.count || 0} projets
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="h-px bg-emerald-500"
          />
        )}
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {(category.projects || []).length > 0 ? (
              <ul className="max-h-72 overflow-y-auto">
                {(category.projects || []).map((project) => {
                  /* ===== PHASE COURANTE ===== */
                  const currentPhase = project.phases
                    ?.slice()
                    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                    .find((p) => p.status === "En cours");
                
                  const isLate =
                    currentPhase &&
                    currentPhase.endDate &&
                    new Date(currentPhase.endDate) < new Date() &&
                    (currentPhase.completionPercentage ?? 0) < 100 &&
                    currentPhase.status !== "Terminé";


                  return (
                    <li key={project.id}>
                      <div
                        className="relative p-5 cursor-pointer hover:bg-slate-50"
                        onClick={() => navigateDetails(project.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex">
                            <div className="mr-4 mt-1">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <Briefcase size={16} />
                              </div>
                            </div>

                            <div>
                              {/* ===== TITRE ===== */}
                              <p className="font-medium text-sm text-slate-800">
                                {project.title}
                              </p>

                              {/* ===== AVANCEMENT PROJET ===== */}
                              <div className="absolute right-6 top-6">
                                <CircularProgress
                                  value={project.completionPercentage}
                                  color={
                                    project.completionPercentage === 100
                                      ? "#22c55e"
                                      : project.endDate &&
                                        new Date(project.endDate) < new Date()
                                      ? "#ef4444"
                                      : "#3b82f6"
                                  }
                                />
                              </div>
                               {/* ===== DATES PROJET ===== */}
                              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                <div className="flex items-center">
                                  <Calendar size={14} className="mr-1" />
                                  Début : {formatDate(project.startDate)}
                                </div>

                                {project.endDate && (
                                  <div className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    Fin :{" "}
                                    {formatDate(
                                      project.endDate,
                                      false,
                                      false
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* ===== PHASE EN COURS ===== */}
                              {currentPhase && (
                                <div className="mt-4 ml-6 pl-4
                                    flex items-center gap-3
                                    border-l-2 border-slate-200">
                                  <CircularProgress
                                    value={currentPhase.completionPercentage ?? 0}
                                    size={45}
                                    color={isLate ? "#ef4444" : "#0ea5e9"}
                                  />

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-semibold text-slate-700">
                                        {currentPhase.phase1}
                                      </p>

                                      {isLate && (
                                        <span className="
                                          px-2 py-0.5
                                          text-[10px] font-semibold
                                          rounded-full
                                          bg-red-100 text-red-700
                                          border border-red-200
                                        ">
                                          En retard
                                        </span>
                                      )}
                                    </div>


                                    <p className="text-[11px] text-slate-500">
                                      {formatDate(currentPhase.startDate ?? "")} →{" "}
                                      {formatDate(currentPhase.endDate ?? "")}
                                    </p>
                                  </div>
                                </div>
                              )}

                               {/* ===== BADGE PROJET TERMINÉ ===== */}
                              {/* {!currentPhase && isProjectCompleted && (
                                <div className="mt-4 ml-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                  ✅ Projet terminé
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">
                Aucun projet disponible
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectStatsCard;
