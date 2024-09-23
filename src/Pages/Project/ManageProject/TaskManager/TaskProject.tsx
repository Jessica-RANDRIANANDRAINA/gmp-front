import React, { useState, useEffect } from "react";
import ProjectLayout from "../../../../layout/ProjectLayout";
import {
  useParams,
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { IProjectData } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project/ProjectServices";

const TaskProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState<IProjectData>();

  const fetchProject = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <ProjectLayout>
      <div className="">
        <div className="bg-white pt-7 pb-3 px-9">
          <div>Projet : {projectData?.title}</div>
          <div
            className={
              "flex max-[500px]:flex-wrap  gap-4 *:p-3 *:rounded-md *:mt-5 text-xs font-semibold"
            }
          >
            {projectData?.listPhases
              ?.sort((a, b) => a?.rank - b?.rank)
              ?.map((phase) => (
                <NavLink
                  key={phase.rank}
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 bg-green-50  hover:bg-white  "
                      : "hover:text-green-700 text-slate-600   "
                  }
                  to={`/gmp/project/task/${projectId}/${phase.id}`}
                >
                  {phase?.phase1}
                </NavLink>
              ))}
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default TaskProject;
