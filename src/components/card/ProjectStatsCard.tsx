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

type Project = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  title: string;
};

type StatCategory = {
  title: string;
  count?: number;
  projects?: Project[];
};

type Props = {
  category: StatCategory;
};

const ProjectStatsCard = ({ category }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigateDetails = (projectId: string) => {
    navigate(`/gmp/project/details/${projectId}/details`);
  };

  return (
    <div className="w-full  overflow-hidden rounded-xl  bg-white dark:bg-strokedark shadow-lg transition-all duration-300 hover:shadow-xl">
      <div
        className="flex items-center justify-between p-5 cursor-pointer  from-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        role="button"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <BarChart2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-whiten">
              {category.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/50 bg-green-50 rounded-full border border-green-100">
            {category.count || 0} projets
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500"
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
            className="h-px  bg-emerald-500"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            {(category.projects || []).length > 0 ? (
              <ul className="divide-y max-h-72 overflow-y-auto divide-slate-100 dark:divide-formStrokedark">
                {(category.projects || []).map((project) => (
                  <li key={project.id} className="">
                    <div
                      className="p-5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-formStrokedark"
                      onClick={() => navigateDetails(project.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex">
                          <div className="mr-4 mt-1">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 `}
                            >
                              <Briefcase size={16} />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-slate-800 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                              {project.title}
                            </p>

                            <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2">
                              <div className="flex items-center text-xs text-slate-500">
                                <Calendar
                                  size={14}
                                  className="mr-1.5 text-slate-400"
                                />
                                <span>
                                  Début: {formatDate(project.startDate)}
                                </span>
                              </div>
                              <div className="flex items-center text-xs">
                                <Clock
                                  size={14}
                                  className={`mr-1.5 text-slate-400 ${
                                    project.endDate ? "" : "hidden"
                                  }`}
                                />
                                <span
                                  className={
                                    project.endDate
                                      ? "text-slate-500"
                                      : "text-emerald-600 font-medium"
                                  }
                                >
                                  {project.endDate
                                    ? `Fin: ${formatDate(
                                        project.endDate,
                                        false,
                                        false
                                      )}`
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center p-8">
                <div className="text-center p-6 rounded-lg bg-slate-50 max-w-sm">
                  <div className="mb-3 flex justify-center">
                    <div className="p-3 rounded-full bg-slate-100">
                      <Briefcase className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-slate-600 mb-1">Aucun projet disponible</p>
                  <p className="text-xs text-slate-500">
                    Cette catégorie ne contient aucun projet pour le moment.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectStatsCard;
