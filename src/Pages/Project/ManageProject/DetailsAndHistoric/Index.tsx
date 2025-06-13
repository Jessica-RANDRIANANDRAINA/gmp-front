import ProjectLayout from "../../../../layout/ProjectLayout";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { Outlet, NavLink, useParams, useLocation } from "react-router-dom";
import ArchiveProject from "../../../../components/Modals/Project/ArchiveProject";
import { useEffect, useState } from "react";
import { getProjectById } from "../../../../services/Project";
import { IProjectData, IUserProject } from "../../../../types/Project";
import ToogleStateProject from "../../../../components/Modals/Project/ToogleStateProject";
import { ChevronDown } from "lucide-react"; 
import { decodeToken } from "../../../../services/Function/TokenService";

const DetailsAndHistoricProject = () => {
  const { projectId } = useParams();
  const location = useLocation();

  // États des modals
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalRestore, setShowModalRestore] = useState<boolean>(false);
  const [showModalDeblock, setShowModalDeblock] = useState<boolean>(false);
  const [showModalStandBy, setShowModalStandBy] = useState<boolean>(false);
  const [isArchiveFinished, setIsArchiveFinished] = useState<boolean>(false);
  const [showModalNotDebute, setShowModalNotDebute] = useState<boolean>(false);
  const [showModalDebute, setShowModalDebute] = useState<boolean>(false);
  const [showModalTerminate, setShowModalTerminate] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<IProjectData>();
  const [showActions, setShowActions] = useState(false);
  const [decodedToken, setDecodedToken] = useState<any>();
  const [isDirector, setIsDirector] = useState(false);

  // Décodage du token et vérification des rôles
  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Token invalide: ${error}`);
      }
    }
  }, []);

  useEffect(() => {
    if (projectData && decodedToken) {
      const directorCheck = projectData.listUsers.some(
        (userObj: IUserProject) =>
          userObj.userid === decodedToken?.jti && userObj.role === "director"
      );
      setIsDirector(directorCheck);
    }
  }, [projectData, decodedToken]);

  // Récupération des données du projet
  const fetchData = async () => {
    if (projectId) {
      try {
        const project = await getProjectById(projectId);
        setProjectData(project);
      } catch (error) {
        console.error(`Erreur lors de la récupération du projet: ${error}`);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [isArchiveFinished, projectId]);

  // Gestionnaires de modals
  const handleShowModalDelete = () => {
    setShowModalDelete(true);
    setShowActions(false);
  };
  
  const handleShowModalDeblock = () => {
    setShowModalDeblock(true);
    setShowActions(false);
  };
  
  const handleShowModalRestore = () => {
    setShowModalRestore(true);
    setShowActions(false);
  };
  
  const handleShowModalStandBy = () => {
    setShowModalStandBy(true);
    setShowActions(false);
  };
  
  const handleShowModalDebute = () => {
    setShowModalDebute(true);
    setShowActions(false);
  };
  
  // const handleShowModalNotDebute = () => {
  //   setShowModalNotDebute(true);
  //   setShowActions(false);
  // };
  
  const handleShowModalTerminate = () => {
    setShowModalTerminate(true);
    setShowActions(false);
  };

  return (
    <ProjectLayout>
      <div className="">
        <div className="mx-4 pt-4 md:mx-10">
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
              {/* <NavLink
                to={`/gmp/project/update/${projectId}`}
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
                    : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
                }
              >
                Modifier
              </NavLink> */}
              {isDirector && (
                <NavLink 
                  to={`/gmp/project/advancement/${projectId}/update`}
                  className={({ isActive }) =>
                    isActive
                      ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
                      : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
                  }
                >
                  Avancement
                </NavLink>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="flex items-center gap-1 px-3 py-2 text-slate-600 border border-green-700 rounded hover:bg-gray-200 transition-colors"
              >
                Actions
                <ChevronDown className={`w-4 h-4 transition-transform ${showActions ? 'rotate-180' : ''}`} />
              </button>

              {showActions && (
  <div className="absolute right-0 mt-2 w-56 bg-white border border-green-700 rounded shadow-md z-50">
    <NavLink
      to={`/gmp/project/update/${projectId}`}
      className={({ isActive }) =>
        isActive
          ? "block px-4 py-2 text-green-800 bg-green-100 rounded-lg"
          : "block px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
      }
      onClick={() => setShowActions(false)}
    >
      Modifier
    </NavLink>
    
        {(!projectData?.state || projectData?.state === "") && (
      <>
        <button 
          onClick={handleShowModalDebute}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Commencer (En cours)
        </button>
        <button
          onClick={handleShowModalTerminate}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Terminer
        </button>
        <button
          onClick={handleShowModalDelete}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Archiver
        </button>
        <button
          onClick={handleShowModalStandBy}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Mettre en stand by
        </button>
      </>
    )}
    
    {/* Actions selon l'état du projet */}
    {projectData?.state === "Pas commencé" && (
      <>
        <button 
          onClick={handleShowModalDebute}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Commencer (En cours)
        </button>
        <button
          onClick={handleShowModalTerminate}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Terminer
        </button>
        <button
          onClick={handleShowModalDelete}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Archiver
        </button>
        <button
          onClick={handleShowModalStandBy}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Mettre en stand by
        </button>
      </>
    )}
    
    {projectData?.state === "Commencer/En cours" && (
      <>
      <button
        onClick={handleShowModalTerminate}
        disabled={projectData?.completionPercentage !== 100}
        className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
          projectData?.completionPercentage === 100
            ? "text-slate-600 hover:bg-green-100 hover:text-green-800"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        Terminer
      </button>
        <button
          onClick={handleShowModalDelete}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Archiver
        </button>
        <button
          onClick={handleShowModalStandBy}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Mettre en stand by
        </button>
      </>
    )}
    
    {projectData?.state === "Terminer" && (
      <>
        <button
          onClick={handleShowModalDelete}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Archiver
        </button>
        <button
          onClick={handleShowModalStandBy}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Mettre en stand by
        </button>
      </>
    )}
    
    {projectData?.state === "Archiver" && (
      <>
        <button
          onClick={handleShowModalRestore}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Restaurer
        </button>
        <button
          onClick={handleShowModalStandBy}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Mettre en stand by
        </button>
      </>
    )}
    
    {projectData?.state === "Mettre en stand by" && (
      <>
        <button
          onClick={handleShowModalDelete}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Archiver
        </button>
        <button
          onClick={handleShowModalDeblock}
          className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-green-100 hover:text-green-800 rounded-lg transition-all duration-200"
        >
          Débloquer
        </button>
      </>
    )}
  </div>
)}
            </div>
          </div>
        </div>
        
        <div className="border mx-4 md:mx-9 rounded-lg p-4 bg-white min-h-[80vh] shadow-1 border-zinc-200 dark:border-strokedark dark:bg-boxdark">
          <Outlet />
        </div>
        
        {/* Modals pour les changements d'état */}
        {showModalDelete && (
          <ArchiveProject
            showModalDelete={showModalDelete}
            setShowModalDelete={setShowModalDelete}
            projectsToDetele={[projectId ?? ""]}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        
        {showModalRestore && (
          <ToogleStateProject
            showModal={showModalRestore}
            projectId={projectId ?? ""}
            type="Restaurer"
            setShowModal={setShowModalRestore}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        
        {showModalDeblock && (
          <ToogleStateProject
            showModal={showModalDeblock}
            projectId={projectId ?? ""}
            type="Reprendre"
            setShowModal={setShowModalDeblock}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        
        {showModalStandBy && (
          <ToogleStateProject
            showModal={showModalStandBy}
            projectId={projectId ?? ""}
            type="Stand by"
            setShowModal={setShowModalStandBy}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        
        {showModalNotDebute && (
          <ToogleStateProject 
            showModal={showModalNotDebute}
            projectId={projectId ?? ""}
            type="Pas commencé"
            setShowModal={setShowModalNotDebute}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}

        {showModalDebute && (
          <ToogleStateProject 
            showModal={showModalDebute}
            projectId={projectId ?? ""}
            type="Commencer/En cours"
            setShowModal={setShowModalDebute}
            setIsArchiveFinished={setIsArchiveFinished}
          />
        )}
        
        {showModalTerminate && (
          <ToogleStateProject
            showModal={showModalTerminate}
            projectId={projectId ?? ""}
            type="Terminer"
            setShowModal={setShowModalTerminate}
            setIsArchiveFinished={setIsArchiveFinished}
            projectData={projectData}
          />
        )}
      </div>
    </ProjectLayout>
  );
};

export default DetailsAndHistoricProject;