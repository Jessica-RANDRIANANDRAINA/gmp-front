import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../../../layout/ProjectLayout";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import { TableProjet } from "../../../components/Tables/projets";
import ArchiveProject from "../../../components/Modals/Project/ArchiveProject";
import {
  getAllLevelProjectByUserId,
  getAllProject,
} from "../../../services/Project";
import { getAllUsers } from "../../../services/User";
import { getAllMyHabilitation } from "../../../services/Function/UserFunctionService";
import { decodeToken } from "../../../services/Function/TokenService";
type TSubordinate = {
  id: string;
  name: string;
  email: string;
};
const ManageProjects = () => {
  const [projectData, setProjectData] = useState<Array<any> | null>(null);
  const [projectToModif, setProjectToModif] = useState([]);
  const [projectsToDetele, setProjectsToDelete] = useState<Array<string>>([]);
  const [projectsSelected, setProjectsSelected] = useState<Array<string>>([]);
  const [idProjectForDetails, setIdProjectForDetails] = useState("");
  const [goToAdvancement, setGoToAdvancement] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [goToDetails, setGoToDetails] = useState(false);
  const [goToHistoric, setGoToHistoric] = useState(false);
  const [goToTask, setGoToTask] = useState(false);
  const [isArchiveFinished, setIsArchiveFinished] = useState<boolean>(false);
  const [isSearchButtonClicked, setIsSearchButtonClicked] =
    useState<boolean>(false);
  const [totalProjectCount, setTotalProjectCount] = useState<number>(0);
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [search, setSearch] = useState({
    title: "",
    member: "",
    priority: "Tous",
    criticity: "Tous",
    completionPercentage: "Tous",
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
  });
  const [collaborator, setCollaborator] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [selectedUserInput, setSelecteduserInput] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const availableUser = collaborator.filter(
    (user) => !selectedUserInput.some((selected) => selected.id === user.id)
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (idProjectForDetails !== "") {
      navigate(`/gmp/project/details/${idProjectForDetails}/details`);
    }
  }, [idProjectForDetails]);

  useEffect(() => {
    if (projectsSelected.length > 0) {
      if (goToDetails) {
        navigate(`/gmp/project/details/${projectsSelected?.[0]}/details`);
      }
      if (goToHistoric) {
        navigate(`/gmp/project/details/${projectsSelected?.[0]}/historic`);
      }
      if (goToAdvancement) {
        navigate(`/gmp/project/advancement/${projectsSelected?.[0]}/update`);
      }
      if (goToTask) {
        navigate(`/gmp/project/task/${projectsSelected?.[0]}`);
      }
    }
  }, [goToDetails, goToHistoric, goToAdvancement, goToTask]);

  useEffect(() => {
    if (projectToModif.length > 0) {
      navigate(`/gmp/project/update/${projectToModif?.[0]}`);
    }
  }, [projectToModif]);

  // fetch user
  const fetchuser = async () => {
    const users: TSubordinate[] = await getAllUsers();
    const transformedArray = users?.map(({ id, name, email }) => ({
      id,
      name,
      email,
    }));
    setCollaborator(transformedArray);
  };
  useEffect(() => {
    fetchuser();
  }, []);

  // fetch all project related to the user connected
  const fetchProject = async () => {
    const decode = decodeToken("pr");

    const hab = await getAllMyHabilitation();
    const completion =
      search.completionPercentage === "Tous" ? "" : search.completionPercentage;
    const criticity = search?.criticity === "Tous" ? "" : search?.criticity;
    const priority = search?.priority === "Tous" ? "" : search?.priority;
    const userSelectedName = selectedUserInput?.map((user) => user.name);

    if (hab?.project?.watchAllProject) {
      const project = await getAllProject(
        page?.pageNumber,
        page?.pageSize,
        search?.title,
        userSelectedName,
        priority,
        criticity,
        completion,
        search?.startDate,
        search?.endDate
      );

      setProjectData(project?.project);
      setTotalProjectCount(project?.totalCount);
    } else {
      // const project = await getProjectByUserId(decode?.jti);
      const project = await getAllLevelProjectByUserId(
        decode?.jti,
        page?.pageNumber,
        page?.pageSize,
        search?.title,
        userSelectedName,
        priority,
        criticity,
        completion,
        search?.startDate,
        search?.endDate
      );
      setProjectData(project?.project);
      setTotalProjectCount(project?.totalCount);
    }
  };

  useEffect(() => {
    fetchProject();
    setIsArchiveFinished(false);
    setIsSearchButtonClicked(false);
  }, [showModalDelete, isArchiveFinished, page, isSearchButtonClicked]);

  return (
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10 ">
        <>
          <div className="flex flex-col md:flex-row">
            <Breadcrumb
              paths={[{ name: "Liste des Projets", to: "/gmp/project/list" }]}
            />
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
          </div>
          {/* ===== TABLE PROJECT LIST START =====*/}
          <TableProjet
            setShowModalDelete={setShowModalDelete}
            data={projectData}
            setProjectToModif={setProjectToModif}
            setProjectsToDelete={setProjectsToDelete}
            setIdProjectForDetails={setIdProjectForDetails}
            setGoToDetails={setGoToDetails}
            setGoToHistoric={setGoToHistoric}
            setProjectsSelected={setProjectsSelected}
            setGoToAdvancement={setGoToAdvancement}
            setGoToTask={setGoToTask}
            setPage={setPage}
            totalProjectCount={totalProjectCount}
            setIsSearchButtonClicked={setIsSearchButtonClicked}
            setSearch={setSearch}
            search={search}
            availableUser={availableUser}
            selectedUserInput={selectedUserInput}
            setSelecteduserInput={setSelecteduserInput}
          />
          {/* ===== TABLE PROJECT LIST END =====*/}
          {/* ===== MODAL DELETE START ===== */}
          {showModalDelete && (
            <ArchiveProject
              setIsArchiveFinished={setIsArchiveFinished}
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
