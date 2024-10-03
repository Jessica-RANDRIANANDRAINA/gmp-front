import React from "react";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { Outlet, NavLink, useParams } from "react-router-dom";

const DetailsAndHistoricProject = () => {
  const { projectId } = useParams();
  return (
    <ProjectLayout>
      <div>
        <div className=" pt-7  px-9">
          <div className="flex *:p-3 text-sm">
            <NavLink
              to={`/gmp/project/details/${projectId}/details`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-800 bg-green-100 border border-green-700"
                  : "hover:text-green-700 text-slate-600 "
              }
            >
              Détails
            </NavLink>
            <NavLink
              to={`/gmp/project/details/${projectId}/historic`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 bg-green-100 border border-green-700"
                  : "hover:text-green-800 text-slate-600 "
              }
            >
              Historique
            </NavLink>
          </div>
        </div>
        <div className="border mx-9 rounded-lg p-4 bg-white min-h-[80vh] shadow-1 border-zinc-200 dark:border-strokedark dark:bg-boxdark ">
          <Outlet />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default DetailsAndHistoricProject;
