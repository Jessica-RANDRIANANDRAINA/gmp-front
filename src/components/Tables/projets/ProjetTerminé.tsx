import { useEffect, useMemo, useState } from "react";
import {
  CustomInput,
  CustomSelect,
  CustomInputUserSpecifiedSearch} from "../../UIElements";
import { Calendar, Table } from "lucide-react";
import { formatDate } from "../../../services/Function/DateServices";
import Pagination from "../Pagination";
import ListUsers from "../../UIElements/ListUsers";
import { getAllMyHabilitation } from "../../../services/Function/UserFunctionService";
import { IProjectData } from "../../../types/Project";
import { IMyHabilitation } from "../../../types/Habilitation";
import { SyncLoader } from "react-spinners";
import PerPageInput from "../../UIElements/Input/PerPageInput";
import { IDecodedToken } from "../../../types/user";
import { decodeToken } from "../../../services/Function/TokenService";
import GanttChart from "../../chart/GanttChart";

const ProjetTerminé = ({
  data,
  setProjectToModif,
  setIdProjectForDetails,
  totalProjectCount,
  search,
  availableUser,
  selectedUserInput,
  setSelecteduserInput,
  setSearch,
  setProjectsToDelete,
  setShowModalDelete,
  setGoToDetails,
  setGoToHistoric,
  setProjectsSelected,
  setGoToAdvancement,
  setGoToTask,
  setPage,
  setIsSearchButtonClicked,
}: {
  data: Array<any> | null;
  totalProjectCount: number;
  setProjectToModif: Function;
  setIdProjectForDetails: Function;
  search: {
    title: string;
    member: string;
    priority: string;
    criticity: string;
    completionPercentage: string;
    startDate: string | undefined;
    endDate: string | undefined;
  };
  availableUser: {
    id: string;
    name: string;
    email: string;
  }[];
  selectedUserInput: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  setSelecteduserInput: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string;
        name: string;
        email: string;
      }>
    >
  >;
  setProjectsToDelete: React.Dispatch<React.SetStateAction<Array<string>>>;
  setProjectsSelected: React.Dispatch<React.SetStateAction<Array<string>>>;
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToHistoric: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToAdvancement: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToTask: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearchButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<
    React.SetStateAction<{
      pageNumber: number;
      pageSize: number;
    }>
  >;
  setSearch: React.Dispatch<
    React.SetStateAction<{
      title: string;
      member: string;
      priority: string;
      criticity: string;
      completionPercentage: string;
      startDate: string | undefined;
      endDate: string | undefined;
    }>
  >;
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [dataSorted, setDataSorted] = useState({
    title: 0,
    codeProjet: 0,
    startDate: 0,
    endDate: 0,
    completionPercentage: 0,
    priority: 0,
    criticality: 0,
  });

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();
  const [isTableView, setIsTableView] = useState<boolean>(true);
  const [, setDecodedToken] = useState<IDecodedToken>();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }
  }, []);

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getHab();
  }, []);

  
  // Filtrer uniquement les projets archivés
const completedProjects = useMemo(() => {
  return data || []; // On utilise directement les données car l'API filtre déjà les projets archivés
}, [data]);


console.log("archiver", completedProjects);
  const sortedData = completedProjects?.slice().sort((a: IProjectData, b: IProjectData) => {
    if (dataSorted.title === 1) {
      return a.title.localeCompare(b.title);
    } else if (dataSorted.title === 2) {
      return b.title.localeCompare(a.title);
    }

    if (dataSorted.startDate === 1) {
      return a.startDate?.localeCompare(b.startDate ?? "") || 0;
    } else if (dataSorted.startDate === 2) {
      return b.startDate?.localeCompare(a.startDate ?? "") || 0;
    }

    if (dataSorted.endDate === 1) {
      if (a.endDate === null) return 1;
      if (b.endDate === null) return -1;
      return a.endDate?.localeCompare(b.endDate ?? "") || 0;
    } else if (dataSorted.endDate === 2) {
      if (a.endDate === null) return 1;
      if (b.endDate === null) return -1;
      return b.endDate?.localeCompare(a.endDate ?? "") || 0;
    }

    if (dataSorted.completionPercentage === 1) {
      if (a.completionPercentage === undefined) return 1;
      if (b.completionPercentage === undefined) return -1;
      return a.completionPercentage - b.completionPercentage;
    } else if (dataSorted.completionPercentage === 2) {
      if (a.completionPercentage === undefined) return 1;
      if (b.completionPercentage === undefined) return -1;
      return b.completionPercentage - a.completionPercentage;
    }

    const priorityOrder: { [key: string]: number } = {
      Faible: 1,
      Moyenne: 2,
      Elevée: 3,
    };
    if (dataSorted.priority === 1) {
      const priorityA = priorityOrder[a.priority] ?? 0;
      const priorityB = priorityOrder[b.priority] ?? 0;
      return priorityA - priorityB;
    } else if (dataSorted.priority === 2) {
      const priorityA = priorityOrder[a.priority] ?? 0;
      const priorityB = priorityOrder[b.priority] ?? 0;
      return priorityB - priorityA;
    }

    const criticalityOrder: { [key: string]: number } = {
      Normale: 1,
      Urgente: 2,
    };
    if (dataSorted.criticality === 1) {
      const criticalityA = criticalityOrder[a.criticality] ?? 0;
      const criticalityB = criticalityOrder[b.criticality] ?? 0;
      return criticalityA - criticalityB;
    } else if (dataSorted.criticality === 2) {
      const criticalityA = criticalityOrder[a.criticality] ?? 0;
      const criticalityB = criticalityOrder[b.criticality] ?? 0;
      return criticalityB - criticalityA;
    }

    return 0;
  });

  const project = useMemo(() => {
    return completedProjects?.flatMap((pr: any) => [
      {
        id: pr.id,
        text: pr.title,
        start_date: new Date(pr.startDate),
        end_date: pr.endDate === null ? new Date(pr.startDate) : new Date(pr.endDate),
        progress: pr.completionPercentage / 100,
        type: "project",
      },
      ...pr.listPhases.map((phase: any) => ({
        id: phase.id,
        text: phase.phase1,
        start_date: phase.startDate === null ? new Date(pr.startDate) : new Date(phase.startDate),
        end_date: phase.endDate === null ? new Date(phase.startDate) : new Date(phase.endDate),
        parent: pr.id,
        progress: phase.status === "Terminé" ? 1 : 0,
        type: "phase",
      })),
    ]);
  }, [completedProjects]);

  useEffect(() => {
    if (JSON.stringify(project) !== JSON.stringify(tasks)) {
      const projects = project?.filter((item) => !item.parent);
      const phases = project?.filter((item) => item.parent);
      const sortedPhases = phases?.sort((a, b) => a.start_date - b.start_date);
      const sortedP = [...(projects || []), ...(sortedPhases || [])];
      setTasks(sortedP || []);
    }
  }, [project]);

  const handleDeleteFilter = () => {
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
    setIsSearchButtonClicked(true);
  };

  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };

  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };

  useEffect(() => {
    setActualPage(1);
    setPageNumbers(getPageNumber(totalProjectCount));
  }, [entriesPerPage, totalProjectCount]);

  useEffect(() => {
    setActualPage(1);
    setProjectSelected([]);
    setIsAllSelected(false);
  }, [search]);

  useEffect(() => {
    setPage((prev) => ({
      ...prev,
      pageNumber: actualPage,
    }));
  }, [actualPage]);

  // const handleSelectAllProject = () => {
  //   if (completedProjects) {
  //     if (projectSelected.length < completedProjects.length) {
  //       setProjectSelected([]);
  //       completedProjects.map((p) => setProjectSelected((prev) => [...prev, p.id]));
  //       setIsAllSelected(true);
  //     } else {
  //       setProjectSelected([]);
  //       setIsAllSelected(false);
  //     }
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsSearchButtonClicked(true);
    }
  };

  const handleRemoveUserSelectedInput = (userId: string) => {
    const updatedSelectedUsers = selectedUserInput.filter(
      (user) => user.id !== userId
    );
    setSelecteduserInput(updatedSelectedUsers);
  };

  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* ===== FILTER START ===== */}
      <div className="flex gap-3 m-5 flex-wrap justify-between items-center">
        <div
          onKeyDown={handleKeyDown}
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 grid-cols-1 gap-3 w-full"
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

          <CustomSelect
            label="Priorité"
            data={["Tous", "Elevée", "Moyenne", "Faible"]}
            value={search.priority}
            onValueChange={(e) => {
              setSearch({
                ...search,
                priority: e,
              });
            }}
          />
          <CustomSelect
            label="Criticité"
            data={["Tous", "Urgente", "Normale"]}
            value={search.criticity}
            onValueChange={(e) => {
              setSearch({
                ...search,
                criticity: e,
              });
            }}
          />

          <CustomSelect
            label="Avancement"
            data={["Tous", "0", "25", "50", "75", "100"]}
            value={search.completionPercentage}
            onValueChange={(e) => {
              setSearch({
                ...search,
                completionPercentage: e,
              });
            }}
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
                onClick={() => {
                  setIsSearchButtonClicked(true);
                }}
                className=" px-2 cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  "
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
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
      {/* ===== FILTER END ===== */}
      <div className="flex gap-4 pl-4">
        <button
          onClick={() => setIsTableView(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg   transition-colors duration-300 transform hover:scale-105 focus:outline-none ${
            isTableView
              ? "border-primaryGreen bg-primaryGreen  dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
              : "bg-slate-600  hover:bg-slate-700"
          }`}
        >
          <Table className="text-white" size={20} />
        </button>
        <button
          onClick={() => setIsTableView(false)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg  transition-colors duration-300 transform hover:scale-105 focus:outline-none ${
            !isTableView
              ? "border-primaryGreen bg-primaryGreen  dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
              : "bg-slate-600  hover:bg-slate-700"
          }`}
        >
          <Calendar className="text-white" size={20} />
        </button>
      </div>
      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 items-center flex justify-between px-3 transition-opacity ${
          isAllSelected || projectSelected.length > 0
            ? "opacity-0"
            : "opacity-100"
        }`}
      >
        <button
          disabled={actualPage === 1}
          className="rotate-180"
          onClick={() => setActualPage((prev) => Math.max(prev - 1, 1))}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === 1 ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-xl text-center text-title font-semibold dark:text-whiten">
          Liste des projets terminés
        </div>
        <button
          disabled={actualPage === pageNumbers}
          onClick={() =>
            setActualPage((prev) => Math.min(prev + 1, pageNumbers))
          }
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === pageNumbers ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* =====PAGINATE AND TITLE END===== */}
      {/* ===== BULK START ===== */}
      {projectSelected.length !== 1 && (
      <div
        className={` mt-[-60px] border-primaryGreen border dark:border-formStrokedark  bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          projectSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        {projectSelected.length !== 1 && (
    <div>
      {projectSelected.length === 1
        ? "1 élément sélectionné"
        : `${projectSelected.length} éléments sélectionnés`}
    </div>
  )}


        <div>
          {projectSelected.length > 1 ? (
      <button
        onClick={() => {
          setProjectsToDelete(projectSelected);
          setShowModalDelete(true);
        }}
        className="mb-1 mt-1 min-w-20 w-full text-sm py-2.5 px-3 md:h-10 border flex items-center justify-between border-stroke dark:border-formStrokedark rounded-lg  text-left text-black "
      >
        Archiver
      </button>
    ) : (
      
      <CustomSelect
        data={
          projectSelected.length > 1
            ? ["Archiver"].filter((action) => {
                if (
                  myHabilitation?.project.delete === false &&
                  action === "Archiver"
                ) {
                  return false;
                }
                return true;
              })
            : []
        }
        className={`mb-2 ${projectSelected.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder="Actions"
        disabled={projectSelected.length < 1}
        onValueChange={(e) => {
          if (e.includes("Modifier")) {
            setProjectToModif(projectSelected);
          } else if (e.includes("Archiver")) {
            setProjectsToDelete(projectSelected);
            setShowModalDelete(true);
          } else if (e.includes("Détails")) {
            setProjectsSelected(projectSelected);
            setGoToDetails(true);
          } else if (e.includes("Historique")) {
            setProjectsSelected(projectSelected);
            setGoToHistoric(true);
          } else if (e.includes("Avancement")) {
            setProjectsSelected(projectSelected);
            setGoToAdvancement(true);
          } else if (e.includes("Gérer")) {
            setProjectsSelected(projectSelected);
            setGoToTask(true);
          }
        }}
      />
    )}
    
        </div>


      </div>
    )}
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      {isTableView ? (
        <div className="max-w-full mb-4 overflow-x-auto ">
          <table className="w-full text-sm hidden md:table table-auto">
            {/* ===== TABLE HEAD START ===== */}
            <thead className="pt-5  rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
              <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
                {/* <th className="pl-2">
                  <button
                    onClick={handleSelectAllProject}
                    className="cursor-pointer border w-5 h-5"
                  >
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${
                        projectSelected.length === archivedProjects?.length
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </th> */}
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                    <div className="flex items-center gap-1">
                      <span>Code Projet</span>
                      <button
                        className={`transform transition-transform duration-200`}
                        onClick={() => {
                          setDataSorted({
                            ...dataSorted,
                            title: 0,
                            startDate: 0,
                            endDate: 0,
                            completionPercentage: 0,
                            criticality: 0,
                            priority: 0,
                            codeProjet:
                              dataSorted.codeProjet < 2 ? dataSorted.codeProjet + 1 : 0, 
                          })
                        }}
                      >
                        <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.codeProjet === 0
                                  ? "fill-white"
                                  : dataSorted.codeProjet === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.codeProjet === 0
                                  ? "fill-white"
                                  : dataSorted.codeProjet === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                    </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Titre</span>
                    <button
                      className={`
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          title:
                            dataSorted.title < 2 ? dataSorted.title + 1 : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.title === 0
                                  ? "fill-white"
                                  : dataSorted.title === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.title === 0
                                  ? "fill-white"
                                  : dataSorted.title === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Priorité</span>
                    <button
                      className={`
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          title: 0,
                          priority:
                            dataSorted.priority < 2
                              ? dataSorted.priority + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.priority === 0
                                  ? "fill-white"
                                  : dataSorted.priority === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.priority === 0
                                  ? "fill-white"
                                  : dataSorted.priority === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Criticité</span>
                    <button
                      className={`
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          startDate: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          priority: 0,
                          title: 0,
                          criticality:
                            dataSorted.criticality < 2
                              ? dataSorted.criticality + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.criticality === 0
                                  ? "fill-white"
                                  : dataSorted.criticality === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.criticality === 0
                                  ? "fill-white"
                                  : dataSorted.criticality === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center">
                    <span>CDP</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center">
                    <span>Équipes</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Date début</span>
                    <button
                      className={`
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          endDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          startDate:
                            dataSorted.startDate < 2
                              ? dataSorted.startDate + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.startDate === 0
                                  ? "fill-white"
                                  : dataSorted.startDate === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.startDate === 0
                                  ? "fill-white"
                                  : dataSorted.startDate === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Date de fin</span>
                    <button
                      className={`
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          startDate: 0,
                          completionPercentage: 0,
                          criticality: 0,
                          priority: 0,
                          endDate:
                            dataSorted.endDate < 2 ? dataSorted.endDate + 1 : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.endDate === 0
                                  ? "fill-white"
                                  : dataSorted.endDate === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.endDate === 0
                                  ? "fill-white"
                                  : dataSorted.endDate === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                {/* <th className="py-4 px-4  font-bold text-white dark:text-white xl:pl-11">
                  <div className="flex items-center gap-1">
                    <span>Avancement</span>
                    <button
                      className={`
                        
                     transform transition-transform duration-200`}
                      onClick={() => {
                        setDataSorted({
                          ...dataSorted,
                          title: 0,
                          startDate: 0,
                          endDate: 0,
                          criticality: 0,
                          priority: 0,
                          completionPercentage:
                            dataSorted.completionPercentage < 2
                              ? dataSorted.completionPercentage + 1
                              : 0,
                        });
                      }}
                    >
                      <svg
                        className="fill-white"
                        height="15"
                        width="15"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 425 425"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g>
                            {" "}
                            <polygon
                              className={`${
                                dataSorted.completionPercentage === 0
                                  ? "fill-white"
                                  : dataSorted.completionPercentage === 1
                                  ? "fill-black"
                                  : "fill-primaryGreen dark:fill-darkgreen"
                              }`}
                              points="212.5,0 19.371,192.5 405.629,192.5 "
                            ></polygon>{" "}
                            <polygon
                              className={`${
                                dataSorted.completionPercentage === 0
                                  ? "fill-white"
                                  : dataSorted.completionPercentage === 1
                                  ? "fill-primaryGreen dark:fill-darkgreen"
                                  : "fill-black"
                              }`}
                              points="212.5,425 405.629,232.5 19.371,232.5 "
                            ></polygon>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </button>
                  </div>
                </th>
                <th className="py-4 px-4  font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center gap-1">
                <span>Actions</span>
                </div>
                </th> */}
              </tr>
            </thead>
            {/* ===== TABLE HEAD END ===== */}
            {/* ===== TABLE BODY START ===== */}
            <tbody>
              {!completedProjects ? (
                <tr>
                  <td colSpan={9} className="py-9 content-center">
                    <div className="flex justify-center items-center">
                      <SyncLoader size={18} color={"teal"} />
                    </div>
                  </td>
                </tr>
              ) : completedProjects?.length === 0 ? (
                <tr className="hover:bg-whiten dark:hover:bg-boxdark2">
                  <td colSpan={9} className="py-9 content-center ">
                    <div className="flex justify-center items-center">
                      Aucun projet terminé trouvé
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData
                  ?.map((project) => {
                    const dateStart = formatDate(project?.startDate);
                    const dateEnd = formatDate(project?.endDate);
                    // const today = new Date();
                    // const dateEndCHeck = new Date(project?.endDate);
                    // const isDateEndPassed =
                    //   dateEndCHeck < today &&
                    //   project?.completionPercentage !== 100 &&
                    //   dateEnd !== "--";

                    return (
                      <tr
                        key={project?.id}
                        className="hover:bg-whiten dark:hover:bg-boxdark2"
                        
                      >
                        {/* <td className="pl-2 border-b border-[#eee]">
                          <button
                            className="cursor-pointer border w-5 h-5"
                            onClick={() => {
                              setProjectSelected((prev) => {
                                if (prev?.includes(project.id)) {
                                  return prev.filter((id) => id !== project.id);
                                } else {
                                  return [...prev, project.id];
                                }
                              });
                            }}
                          >
                            <svg
                              width="18"
                              height="17"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={`${
                                projectSelected.includes(project.id)
                                  ? "visible"
                                  : "invisible"
                              }`}
                            >
                              <path
                                d="M4 12.6111L8.92308 17.5L20 6.5"
                                className="stroke-black-2 dark:stroke-whiten"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </td> */}
                        <td 
                          className="border-b max-w-90 min-w-50 border-[#eee] pl-9 py-5 dark:border-strokedark cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                              <p className="text-black text-justify  dark:text-white font-bold ">
                                {project?.codeProjet}
                              </p>
                        </td>
                        <td
                          className="border-b max-w-90 min-w-50 border-[#eee] pl-9  py-5 dark:border-strokedark cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p className="text-black text-justify  dark:text-white font-bold ">
                            {project?.title}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p
                            className={`  font-semibold rounded-md  text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.priority === "Moyenne"
                                ? "bg-amber-100 border text-amber-600 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700 "
                                : project?.priority === "Faible"
                                ? "bg-cyan-100 border text-cyan-600 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700 "
                                : project?.priority === "Elevée"
                                ? "bg-red-100 border text-red-600 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700 "
                                : ""
                            }
                            `}
                          >
                            {project?.priority}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p
                            className={` font-semibold rounded-md whitespace-nowrap text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.criticality === "Urgente"
                                ? "bg-amber-100 border text-amber-600 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                                : "bg-cyan-100 border text-cyan-600 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700 "
                            }
                            `}
                          >
                            {project?.criticality}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <ListUsers
                            data={project?.listUsers}
                            type="director"
                          />
                        </td>
                        <td className="border-b  gap-1 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <ListUsers
                            data={project?.listUsers}
                            type="no-director"
                          />
                        </td>
                        <td className="border-b    border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p className="text-black  pr-4 dark:text-white">
                            {dateStart}
                          </p>
                        </td>
                        <td className="border-b  border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <p className="text-black flex  pr-4 gap-1 dark:text-white">
                            {/* {isDateEndPassed ? (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 64 64"
                                aria-hidden="true"
                                preserveAspectRatio="xMidYMid meet"
                                fill="#000000"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                  {" "}
                                  <g fill="#ff002f">
                                    {" "}
                                    <path d="M23 42.4H13L9 2h18z"> </path>{" "}
                                    <ellipse
                                      cx="18"
                                      cy="54.4"
                                      rx="7.7"
                                      ry="7.6"
                                    >
                                      {" "}
                                    </ellipse>{" "}
                                    <path d="M51 42.4H41L37 2h18z"> </path>{" "}
                                    <ellipse
                                      cx="46"
                                      cy="54.4"
                                      rx="7.7"
                                      ry="7.6"
                                    >
                                      {" "}
                                    </ellipse>{" "}
                                  </g>{" "}
                                </g>
                              </svg>
                            ) : null} */}

                            {dateEnd}
                          </p>
                        </td>
                        {/* <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          <div className="w-full bg-zinc-100 rounded-full dark:bg-strokedark h-6 relative">
                            {project?.state === "Stand by" ? (
                              <div className="h-6 rounded-full bg-[length:14px_14px] bg-[repeating-linear-gradient(45deg,#FFCD59_0,#FFCD59_3px,transparent_3px,transparent_5px)] w-full"></div>
                            ) : (
                              <div
                                className={`h-6 rounded-full ${
                                  project?.completionPercentage === 0
                                    ? "bg-red-500"
                                    : project?.completionPercentage === 25
                                    ? "bg-orange"
                                    : project?.completionPercentage === 50
                                    ? "bg-yellow-500"
                                    : project?.completionPercentage === 75
                                    ? "bg-lime-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${project?.completionPercentage}%`,
                                }}
                              ></div>
                            )}
                            <span
                              className={`absolute rounded-full inset-0 flex justify-center items-center text-xs font-semibold text-black dark:text-white ${
                                project?.state === "Stand by"
                                  ? "dark:bg-black/40"
                                  : ""
                              }`}
                            >
                              {project?.state === "Stand by"
                                ? project?.state
                                : project?.completionPercentage + "%"}
                            </span>
                          </div>
                        </td> */}
                        {/* <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11 cursor-pointer">
                          <div >
                          <PointSelect
                              data={
                                    [
                                      "Modifier",
                                      "Avancement",
                                      "Gérer",
                                      "Historique",
                                      "Archiver",
                                    ].filter((action) => {
                                      if (
                                        myHabilitation?.project.delete === false &&
                                        action === "Archiver"
                                      ) {
                                        return false;
                                      }
                                      if (
                                        myHabilitation?.project.update === false &&
                                        action === "Modifier"
                                      ) {
                                        return false;
                                      }
                                      // only chef de project can change avancement
                                      if (action === "Avancement") {
                                        const selectedProject = archivedProjects?.find(
                                          (p) => p.id === project.id
                                        );
                                        const isDirector = selectedProject?.listUsers.some(
                                          (userObj: {
                                            userid: string | undefined;
                                            role: string;
                                          }) =>
                                            userObj.userid === decodedToken?.jti &&
                                            userObj.role === "director"
                                        );
                                        return isDirector;
                                      }
                                      return true;
                                    })
                              }
                              className="w-13"
                              placeholder=""
                              onClick={() => {
                                setProjectSelected([project.id]);
                              }}
                              onValueChange={(e) => {
                                if (e.includes("Modifier")) {
                                  setProjectToModif([project.id]);
                                } else if (e.includes("Archiver")) {
                                  setProjectsToDelete([project.id]);
                                  setShowModalDelete(true);
                                } else if (e.includes("Historique")) {
                                  setProjectsSelected([project.id]);
                                  setGoToHistoric(true);
                                } else if (e.includes("Avancement")) {
                                  setProjectsSelected([project.id]);
                                  setGoToAdvancement(true);
                                } else if (e.includes("Gérer")) {
                                  setProjectsSelected([project.id]);
                                  setGoToTask(true);
                                }
                              }}


                            />
                          </div>
                        </td> */}
                      </tr>
                    );
                  })
              )}
            </tbody>
            {/* ===== TABLE BODY END ===== */}
          </table>

          {/* Mobile view */}
          <div className="block md:hidden">
            {sortedData
              ?.filter((_project, index) => indexInPaginationRange(index))
              .map((project) => {
                const dateStart = formatDate(project?.startDate);
                const dateEnd = formatDate(project?.endDate);
                const today = new Date();
                const dateEndCHeck = new Date(project?.endDate);
                const isDateEndPassed =
                  dateEndCHeck < today &&
                  project?.completionPercentage !== 100 &&
                  dateEnd != "--";

                return (
                  <div
                    key={project?.id}
                    className={` *:grid *:grid-cols-2  shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black ${
                      isDateEndPassed
                        ? "bg-red-100 dark:bg-red-200 text-black"
                        : "bg-white dark:bg-boxdark"
                    }`}
                  >
                    <div className="">
                      <button
                        className="relative  cursor-pointer border w-5 h-5"
                        onClick={() => {
                          setProjectSelected((prev) => {
                            if (prev?.includes(project.id)) {
                              return prev.filter((id) => id !== project.id);
                            } else {
                              return [...prev, project.id];
                            }
                          });
                        }}
                      >
                        <svg
                          width="18"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${
                            projectSelected.includes(project.id)
                              ? "visible"
                              : "invisible"
                          }`}
                        >
                          <path
                            d="M4 12.6111L8.92308 17.5L20 6.5"
                            className="stroke-black-2 dark:stroke-whiten"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Titre :{" "}
                      </span>
                      <span className="text-gray-800">
                        <p
                          className="text-black dark:text-white font-bold cursor-pointer"
                          onClick={() => {
                            setIdProjectForDetails(project.id);
                          }}
                        >
                          {project?.title.length > 30
                            ? `${project?.title?.slice(0, 30)}...`
                            : project?.title}
                        </p>
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Priorité :{" "}
                      </span>
                      <span className="text-gray-800">{project?.priority}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Criticité :{" "}
                      </span>
                      <span className="text-gray-800">
                        {project?.criticality}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        CDP :{" "}
                      </span>
                      <span className="text-gray-800">
                        <ListUsers data={project?.listUsers} type="director" />
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Équipe :{" "}
                      </span>
                      <span className="text-gray-800">
                        <ListUsers
                          data={project?.listUsers}
                          type="no-director"
                        />
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Date début :{" "}
                      </span>
                      <span className="text-gray-800">{dateStart}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Date fin :{" "}
                      </span>
                      <span className=" flex gap-1 text-gray-800">
                        {isDateEndPassed ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 64 64"
                            aria-hidden="true"
                            preserveAspectRatio="xMidYMid meet"
                            fill="#000000"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <g fill="#ff002f">
                                {" "}
                                <path d="M23 42.4H13L9 2h18z"> </path>{" "}
                                <ellipse cx="18" cy="54.4" rx="7.7" ry="7.6">
                                  {" "}
                                </ellipse>{" "}
                                <path d="M51 42.4H41L37 2h18z"> </path>{" "}
                                <ellipse cx="46" cy="54.4" rx="7.7" ry="7.6">
                                  {" "}
                                </ellipse>{" "}
                              </g>{" "}
                            </g>
                          </svg>
                        ) : null}
                        {dateEnd}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-emerald-500 font-semibold">
                        Avancement :{" "}
                      </span>
                      <div className="w-full bg-zinc-100 rounded-full dark:bg-strokedark h-6 relative">
                        <div
                          className="bg-primaryGreen h-6 rounded-full"
                          style={{
                            width: `${project?.completionPercentage}%`,
                          }}
                        ></div>
                        <span className="absolute inset-0 flex justify-center items-center text-black dark:text-white text-xs font-semibold">
                          {project?.completionPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <GanttChart tasks={tasks} />
      )}

      {/* =====PAGINATE START===== */}
      <div className="flex flex-col flex-wrap md:flex-row justify-end px-4 items-center">
        <PerPageInput
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          setPage={setPage}
        />
        <Pagination
          actualPage={actualPage}
          setActualPage={setActualPage}
          pageNumbers={pageNumbers}
        />
      </div>
      {/* =====PAGINATE END===== */}
      {/* =====TABLE END===== */}
    </div>
  );
};

export default ProjetTerminé;