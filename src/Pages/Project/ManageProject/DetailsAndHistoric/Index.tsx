import ProjectLayout from "../../../../layout/ProjectLayout";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import ArchiveProject from "../../../../components/Modals/Project/ArchiveProject";
import { useEffect, useState } from "react";
import { getProjectById } from "../../../../services/Project";
import { IProjectData } from "../../../../types/Project";
import ToogleStateProject from "../../../../components/Modals/Project/ToogleStateProject";
import { ChevronDown } from "lucide-react"; 

const DetailsAndHistoricProject = () => {
  const { projectId } = useParams();
  const location = useLocation();

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalRestore, setShowModalRestore] = useState<boolean>(false);
  const [showModalDeblock, setShowModalDeblock] = useState<boolean>(false);
  const [showModalStandBy, setShowModalStandBy] = useState<boolean>(false);
  const [isArchiveFinished, setIsArchiveFinished] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<IProjectData>();
  const [showActions, setShowActions] = useState(false);

  const fetchData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
      setIsArchiveFinished(false)
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
          {location.pathname.includes("historic") ? (
            <Breadcrumb
              paths={[
                { name: "Projets", to: "/gmp/project/list" },
                { name: "Historique" },
              ]}
            />
          ) : (
            <Breadcrumb
              paths={[
                { name: "Projets", to: "/gmp/project/list" },
                { name: "Détails" },
              ]}
            />
          )}
          <div className="flex justify-between items-center flex-wrap px-3 text-sm">
  {/* Partie gauche : le lien "Détails" */}
  <div className="flex gap-3">
    <NavLink
      to={`/gmp/project/details/${projectId}/details`}
      className={({ isActive }) =>
        isActive
          ? "text-green-800 bg-green-100 border border-green-700 px-3 py-2 rounded"
          : "hover:text-green-700 text-slate-600 px-3 py-2"
      }
    >
      Détails
    </NavLink>
    <NavLink
          to={`/gmp/project/details/${projectId}/historic`}
          // className=" hover:bg-gray-100"
          className={({ isActive }) =>
            isActive
              ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
              : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
          }
        >
          Historique
        </NavLink>
        <NavLink
          to={`/gmp/project/task/${projectId}`}
          className={({ isActive }) =>
            isActive
              ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
              : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
          }
        >
          Activités
        </NavLink>
        <NavLink
          to={`/gmp/project/update/${projectId}`}
          className={({ isActive }) =>
            isActive
              ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
              : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
          }
        >
          Modifier
        </NavLink>
  </div>

  {/* Partie droite : le dropdown "Actions" */}
  <div className="relative">
    <button
      onClick={() => setShowActions(!showActions)}
      className="flex items-center gap-1 px-3 py-2 text-slate-600 border border-green-700  rounded hover:bg-gray-200"
    >
      Actions
      <ChevronDown className="w-4 h-4" />
    </button>

    {showActions && (
      <div className="absolute right-0 mt-2 w-56 bg-white border border-green-700 rounded shadow-md z-50">
       
        
        {projectData?.state !== "Archived" && (
          <button
            onClick={handleShowModalDelete}
            className={`block px-4 py-2 text-green-800 hover:text-green-800 rounded-lg ${
              projectData?.state === "Archived" ? "hidden" : "block px-4 py-2 text-slate-600  hover:text-green-800 rounded-lg transition-all duration-200"
            }`}
          >
            Archiver
          </button>
        )}
        {projectData?.state === "Archived" && (
          <button
            onClick={handleShowModalRestore}
            className={`block px-4 py-2 text-green-800 hover:text-green-800 rounded-lg ${
              projectData?.state === "Archived" ? "hidden" : "block px-4 py-2 text-slate-600  hover:text-green-800 rounded-lg transition-all duration-200"
            }`}
          >
            Restaurer
          </button>
        )}
        {projectData?.state !== "Stand by" && (
          <button
            onClick={handleShowModalStandBy}
            className={`block text-green-800 hover:text-green-800 rounded-lg  ${
              projectData?.state === "Stand by" ? "hidden" : "block px-4 py-2 text-slate-600  hover:text-green-800 rounded-lg transition-all duration-200"
            }`}
          >
            Mettre en stand by
          </button>
        )}
        {projectData?.state === "Stand by" && (
          <button
            onClick={handleShowModalDeblock}
            className={`hover:text-green-800 text-slate-600 ${
              projectData?.state === "Stand by" ? "" : "hidden"
            }`}
          >
            Débloquer
          </button>
        )}
      </div>
    )}
  </div>
</div>

          {/* <div className="flex *:p-3 text-sm flex-wrap">
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
            <NavLink
              to={`/gmp/project/task/${projectId}`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 bg-green-100 border border-green-700"
                  : "hover:text-green-800 text-slate-600 "
              }
            >
              Activités
            </NavLink>
            <NavLink
              to={`/gmp/project/update/${projectId}`}
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 bg-green-100 border border-green-700"
                  : "hover:text-green-800 text-slate-600 "
              }
            >
              Modifier
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
          </div> */}
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
              setIsArchiveFinished={setIsArchiveFinished}
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
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        {showModalDeblock && (
          <ToogleStateProject
            showModal={showModalDeblock}
            projectId={projectId ?? ""}
            type={"Débloquer"}
            setShowModal={setShowModalDeblock}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        {showModalStandBy && (
          <ToogleStateProject
            showModal={showModalStandBy}
            projectId={projectId ?? ""}
            type={"Stand by"}
            setShowModal={setShowModalStandBy}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
      </div>
    </ProjectLayout>
  );
};

export default DetailsAndHistoricProject;
