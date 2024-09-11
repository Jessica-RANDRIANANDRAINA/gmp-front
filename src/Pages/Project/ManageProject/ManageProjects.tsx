import { useState, useEffect } from "react";
import ProjectLayout from "../../../layout/ProjectLayout";
import AddProject from "./AddProject";
import UpdateProject from "./UpdateProject";
import { TableProjet } from "../../../components/Tables/projets";
import {
  getProjectByUserId,
  getProjectById,
} from "../../../services/Project/ProjectServices";
import { decodeToken } from "../../../services/Function/TokenService";

const ManageProjects = () => {
  const [isAddProject, setIsAddProject] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [projectDataToModif, setProjectDataToModif] = useState();
  const [projectToModif, setProjectToModif] = useState([]);
  const [isModifProject, setIsModifProject] = useState(false);

  // fetch all project related to the user connected
  const fetchProject = async () => {
    const decode = decodeToken("pr");

    const project = await getProjectByUserId(decode?.jti);
    setProjectData(project);
  };

  const fetchProjectDataBeforeModif = async () => {
    if (projectToModif.length > 0) {
      const project = await getProjectById(projectToModif?.[0]);
      setProjectDataToModif(project);
      setProjectToModif([]);
    }
  };
  useEffect(() => {
    fetchProjectDataBeforeModif();
  }, [isModifProject, projectToModif]);

  useEffect(() => {
    setTimeout(() => {
      fetchProject();
    }, 200);
  }, [isAddProject]);

  return (
    <ProjectLayout>
      <div>
        {!isAddProject && !isModifProject ? (
          <>
            {/* ===== ADD PROJECT START =====*/}
            <div className="w-full mb-2 flex justify-end  items-center">
              <button
                onClick={() => setIsAddProject(true)}
                className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2   text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 12H18M12 6V18"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Ajouter un nouveau projet
              </button>
            </div>
            {/* ===== ADD PROJECT END =====*/}
            {/* ===== TABLE PROJECT LIST START =====*/}
            <TableProjet
              data={projectData}
              setProjectToModif={setProjectToModif}
              setIsModifProject={setIsModifProject}
            />
            {/* ===== TABLE PROJECT LIST END =====*/}
          </>
        ) : isAddProject ? (
          <AddProject setIsAddProject={setIsAddProject} />
        ) : projectDataToModif ? (
          <UpdateProject
            setIsModifProject={setIsModifProject}
            projectDataToModif={projectDataToModif}
            setProjectDataToModif={setProjectDataToModif}
          />
        ) : null}
      </div>
    </ProjectLayout>
  );
};

export default ManageProjects;
