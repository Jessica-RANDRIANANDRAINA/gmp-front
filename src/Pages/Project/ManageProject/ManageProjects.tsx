import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../../../layout/ProjectLayout";
import { TableProjet } from "../../../components/Tables/projets";
import ArchiveProject from "../../../components/Modals/Project/ArchiveProject";
import {
  // getProjectByUserId,
  getAllLevelProjectByUserId,
} from "../../../services/Project/ProjectServices";
import { decodeToken } from "../../../services/Function/TokenService";

const ManageProjects = () => {
  const [projectData, setProjectData] = useState([]);
  const [projectToModif, setProjectToModif] = useState([]);
  const [projectsToDetele, setProjectsToDelete] = useState<Array<string>>([]);
  const [idProjectForDetails, setIdProjectForDetails] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (idProjectForDetails !== "") {
      // navigate(`/gmp/project/task/${idProjectForDetails}`);
      console.log("details: ", idProjectForDetails);
    }
  }, [idProjectForDetails]);

  useEffect(() => {
    if (projectToModif.length > 0) {
      navigate(`/gmp/project/update/${projectToModif?.[0]}`);
    }
  }, [projectToModif]);

  // fetch all project related to the user connected
  const fetchProject = async () => {
    const decode = decodeToken("pr");

    // const project = await getProjectByUserId(decode?.jti);
    const project = await getAllLevelProjectByUserId(decode?.jti);
    setProjectData(project);
  };

  useEffect(() => {
    fetchProject();
    console.log("first");
  }, [showModalDelete]);

  return (
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
        <>
          {/* ===== ADD PROJECT START =====*/}
          <div className="w-full mb-2 flex justify-end  items-center">
            <button
              onClick={() => navigate("/gmp/project/add")}
              className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
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
            setShowModalDelete={setShowModalDelete}
            data={projectData}
            setProjectToModif={setProjectToModif}
            setProjectsToDelete={setProjectsToDelete}
            setIdProjectForDetails={setIdProjectForDetails}
          />
          {/* ===== TABLE PROJECT LIST END =====*/}
          {/* ===== MODAL DELETE START ===== */}
          {showModalDelete && (
            <ArchiveProject
              showModalDelete={showModalDelete}
              setShowModalDelete={setShowModalDelete}
              projectsToDetele={projectsToDetele}
            />
          )}
          {/* ===== MODAL DELETE END ===== */}
        </>
      </div>
    </ProjectLayout>
  );
};

export default ManageProjects;
