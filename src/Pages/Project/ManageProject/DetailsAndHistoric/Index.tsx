import ProjectLayout from "../../../../layout/ProjectLayout";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import ArchiveProject from "../../../../components/Modals/Project/ArchiveProject";
import { useEffect, useState } from "react";
import { getProjectById } from "../../../../services/Project";
import { IProjectData } from "../../../../types/Project";
import ToogleStateProject from "../../../../components/Modals/Project/ToogleStateProject";

const DetailsAndHistoricProject = () => {
  const { projectId } = useParams();
  const location = useLocation();

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalRestore, setShowModalRestore] = useState<boolean>(false);
  const [showModalDeblock, setShowModalDeblock] = useState<boolean>(false);
  const [showModalStandBy, setShowModalStandBy] = useState<boolean>(false);
  const [isArchiveFinished, setIsArchiveFinished] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<IProjectData>();

  const fetchData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isArchiveFinished]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowModalDelete = () => {
    setShowModalDelete(true);
  };
  const handleShowModalDeblock = () => {
    setShowModalDeblock(true);
  };
  const handleShowModalRestore = () => {
    setShowModalRestore(true);
  };
  const handleShowModalStandBy = () => {
    setShowModalStandBy(true);
  };

  return (
    <ProjectLayout>
      <div className="">
        <div className=" mx-4 pt-4 md:mx-10">
          <Breadcrumb
            pageName={`${
              location.pathname.includes("historic") ? "Historique" : "Détail"
            }`}
          />

          <div className="flex *:p-3 text-sm flex-wrap">
            <NavLink
              to={`/gmp/project/details/${projectId}/details`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-800 bg-green-100 border border-green-700"
                  : "hover:text-green-700 text-slate-600 "
              }
            >
              Détail
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
            <NavLink
              to={`/gmp/project/task/${projectId}`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 bg-green-100 border border-green-700"
                  : "hover:text-green-800 text-slate-600 "
              }
            >
              Gérer
            </NavLink>
            <button
              className={`hover:text-green-800 text-slate-600 ${
                projectData?.state === "Archived" ? "hidden" : ""
              }`}
              onClick={handleShowModalDelete}
            >
              Archiver
            </button>
            <button
              className={`hover:text-green-800 text-slate-600 ${
                projectData?.state === "Archived" ? "" : "hidden"
              }`}
              onClick={handleShowModalRestore}
            >
              Restaurer
            </button>
            <button
              className={`hover:text-green-800 text-slate-600 ${
                projectData?.state === "Stand by" ? "hidden" : ""
              }`}
              onClick={handleShowModalStandBy}
            >
              Mettre en stand by
            </button>
            <button
              className={`hover:text-green-800 text-slate-600 ${
                projectData?.state === "Stand by" ? "" : "hidden"
              }`}
              onClick={handleShowModalDeblock}
            >
              Débloquer
            </button>
          </div>
        </div>
        <div className="border mx-4 md:mx-9 rounded-lg p-4 bg-white min-h-[80vh] shadow-1 border-zinc-200 dark:border-strokedark dark:bg-boxdark ">
          <Outlet />
        </div>
        {showModalDelete && (
          <ArchiveProject
            showModalDelete={showModalDelete}
            setShowModalDelete={setShowModalDelete}
            projectsToDetele={[projectId ?? ""]}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        {showModalRestore ||
          showModalDeblock ||
          (showModalStandBy && (
            <ToogleStateProject
              showModal={
                showModalRestore
                  ? showModalRestore
                  : showModalDeblock
                  ? showModalDeblock
                  : showModalStandBy
              }
              projectId={projectId ?? ""}
              type={
                showModalRestore
                  ? "Restaurer"
                  : showModalDeblock
                  ? "Débloquer"
                  : "Stand by"
              }
              setShowModal={
                showModalRestore
                  ? setShowModalRestore
                  : showModalDeblock
                  ? setShowModalDeblock
                  : setShowModalStandBy
              }
            />
          ))}
        {showModalRestore && (
          <ToogleStateProject
            showModal={showModalRestore}
            projectId={projectId ?? ""}
            type={"Restaurer"}
            setShowModal={setShowModalRestore}
          />
        )}
        {showModalDeblock && (
          <ToogleStateProject
            showModal={showModalDeblock}
            projectId={projectId ?? ""}
            type={"Débloquer"}
            setShowModal={setShowModalDeblock}
          />
        )}
        {showModalStandBy && (
          <ToogleStateProject
            showModal={showModalStandBy}
            projectId={projectId ?? ""}
            type={"Stand by"}
            setShowModal={setShowModalStandBy}
          />
        )}
      </div>
    </ProjectLayout>
  );
};

export default DetailsAndHistoricProject;
