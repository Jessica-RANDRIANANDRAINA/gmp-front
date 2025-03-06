import { useEffect, useState } from "react";
import GanttChart from "../../components/chart/GanttChart";
import {
  getAllLevelProjectByUserId,
  getAllProject,
} from "../../services/Project";
import ProjectLayout from "../../layout/ProjectLayout";
import Pagination from "../../components/Tables/Pagination";
import {
  CustomInput,
  CustomInputUserSpecifiedSearch,
} from "../../components/UIElements";
import { getAllUsers } from "../../services/User";
import { decodeToken } from "../../services/Function/TokenService";
import { getAllMyHabilitation } from "../../services/Function/UserFunctionService";

type TSubordinate = {
  id: string;
  name: string;
  email: string;
};

const GanttView = () => {
  const [tasks, setTasks] = useState<any[]>([]);
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

  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);

  const fetchProject = async () => {
    const decode = decodeToken("pr");

    // const hab = await getAllMyHabilitation();
    // const userSelectedName = selectedUserInput?.map((user) => user.name);

    const [hab, userSelectedName] = await Promise.all([
      getAllMyHabilitation(),
      Promise.resolve(selectedUserInput?.map((user) => user.name) || []),
    ]);

    const fetchProjects = hab?.project?.watchAllProject
      ? getAllProject
      : getAllLevelProjectByUserId.bind(null, decode?.jti);

    const fetchedProject = await fetchProjects(
      actualPage,
      15,
      search?.title,
      userSelectedName,
      undefined,
      undefined,
      undefined,
      search?.startDate,
      search?.endDate
    );

    const totalProjectCount = fetchedProject?.totalCount || 0;
    setPageNumbers(Math.ceil(totalProjectCount / 15));

    const project = fetchedProject?.project?.flatMap((pr: any) => [
      {
        id: pr.id,
        text: pr.title,
        start_date: new Date(pr.startDate),
        end_date:
          pr.endDate === null ? new Date(pr.startDate) : new Date(pr.endDate),
        progress: pr.completionPercentage / 100,
      },
      // Ajouter les phases comme objets séparés avec un champ 'parent'
      ...pr.listPhases.map((phase: any) => ({
        id: phase.id,
        text: phase.phase1, // phase name
        start_date:
          phase.startDate === null
            ? new Date(pr.startDate)
            : new Date(phase.startDate),
        // end_date: phase.endDate ? new Date(phase.endDate) : undefined,
        end_date:
          phase.endDate === null
            ? new Date(phase.startDate)
            : new Date(phase.endDate),
        parent: pr.id,
        progress: phase.status === "Terminé" ? 1 : 0,
      })),
    ]);

    const sortedProject = project.sort(
      (a: { start_date: number }, b: { start_date: number }) =>
        a.start_date - b.start_date
    );

    setTasks(sortedProject || []);
  };

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

  const availableUser = collaborator.filter(
    (user) => !selectedUserInput.some((selected) => selected.id === user.id)
  );

  useEffect(() => {
    fetchProject();
  }, [actualPage]);

  // DELETE FILTER
  const handleDeleteFilter = async () => {
    setSearch({
      ...search,
      title: "",
      priority: "Tous",
      criticity: "Tous",
      completionPercentage: "Tous",
      startDate: "",
      endDate: "",
    });

    setSelecteduserInput([]);
    await fetchProject();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchProject();
      // setIsSearchButtonClicked(true);
    }
  };

  const handleRemoveUserSelectedInput = (userId: string) => {
    const updatedSelectedUsers = selectedUserInput.filter(
      (user) => user.id !== userId
    );
    setSelecteduserInput(updatedSelectedUsers);
  };

  return (
    <ProjectLayout>
      <div className="p-10 ">
        <h1 className="text-2xl font-bold mb-4">Chronogramme des Projets</h1>
        <div>
          <div
            onKeyDown={handleKeyDown}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full mb-4"
          >
            <CustomInput
              type="text"
              value={search.title}
              label="Titre"
              placeholder="Rechercher"
              rounded="medium"
              onChange={(e) => {
                setSearch({
                  ...search,
                  title: e.target.value,
                });
              }}
            />
            <CustomInputUserSpecifiedSearch
              label="Membre"
              rounded="medium"
              placeholder="Rechercher"
              user={availableUser}
              userSelected={selectedUserInput}
              setUserSelected={setSelecteduserInput}
            />
            <CustomInput
              type="date"
              value={search.startDate}
              label="Date début"
              rounded="medium"
              onChange={(e) => {
                setSearch({
                  ...search,
                  startDate: e.target.value,
                });
              }}
            />
            <CustomInput
              type="date"
              value={search.endDate}
              label="Date de fin"
              rounded="medium"
              onChange={(e) => {
                setSearch({
                  ...search,
                  endDate: e.target.value,
                });
              }}
            />
            <div className="flex items-end gap-2 mx-3">
              <div className="pb-2">
                <button
                  onClick={handleDeleteFilter}
                  className="flex justify-center whitespace-nowrap text-sm gap-1 h-fit "
                >
                  Effacer les filtres
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#00AE5D"
                  >
                    <path
                      d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={fetchProject}
                  className=" px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  "
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {selectedUserInput.length > 0 &&
              selectedUserInput?.map((user) => (
                <div key={user.id}>
                  <div className="flex mt-2.5 justify-between items-center text-sm border   rounded-md shadow-sm  bg-gray-100 dark:bg-gray-800 transition hover:shadow-md">
                    <span className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium">
                      {user?.name}
                    </span>
                    <button
                      className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => handleRemoveUserSelectedInput(user.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <GanttChart tasks={tasks} />
        <div className="bg-white">
          <Pagination
            actualPage={actualPage}
            setActualPage={setActualPage}
            pageNumbers={pageNumbers}
          />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default GanttView;
