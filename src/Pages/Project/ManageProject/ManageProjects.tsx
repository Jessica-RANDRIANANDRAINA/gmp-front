import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../../../layout/ProjectLayout";
import UpdateProject from "./UpdateProject";
import { TableProjet } from "../../../components/Tables/projets";
import {
  getProjectByUserId,
  getProjectById,
} from "../../../services/Project/ProjectServices";
import { decodeToken } from "../../../services/Function/TokenService";

const ManageProjects = () => {
  const [projectData, setProjectData] = useState([]);
  const [projectDataToModif, setProjectDataToModif] = useState();
  const [projectToModif, setProjectToModif] = useState([]);
  const [isModifProject, setIsModifProject] = useState(false);
  const [idProjectForDetails, setIdProjectForDetails] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (idProjectForDetails !== "") {
      navigate(`/gmp/project/task/${idProjectForDetails}`);
    }
  }, [idProjectForDetails]);

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
    fetchProject();
  }, [isModifProject]);

  return (
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
        {!isModifProject ? (
          <>
            {/* ===== ADD PROJECT START =====*/}
            <div className="w-full mb-2 flex justify-end  items-center">
              <button
                onClick={() => navigate("/gmp/project/add")}
                className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              >
                <svg
                  width="15"
                  height="15"
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
              setIdProjectForDetails={setIdProjectForDetails}
            />
            {/* ===== TABLE PROJECT LIST END =====*/}
          </>
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
