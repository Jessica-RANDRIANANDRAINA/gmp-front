import { useEffect, useState } from "react";
import { CustomInput, CustomSelect } from "../../UIElements";
import { formatDate } from "../../../services/Function/DateServices";
// import { decodeToken } from "../../../services/Function/TokenService";
import Pagination from "../Pagination";
import ListUsers from "../../UIElements/ListUsers";
import { getAllMyHabilitation } from "../../../services/Function/UserFunctionService";
import { IProjectData } from "../../../types/Project";
import { IMyHabilitation } from "../../../types/Habilitation";
import { SyncLoader } from "react-spinners";

const TableProjet = ({
  data,
  setProjectToModif,
  setProjectsToDelete,
  setIdProjectForDetails,
  setShowModalDelete,
  setGoToDetails,
  setGoToHistoric,
  setProjectsSelected,
  setGoToAdvancement,
  setGoToTask,
}: {
  data: Array<any> | null;
  setProjectToModif: Function;
  setIdProjectForDetails: Function;
  setProjectsToDelete: React.Dispatch<React.SetStateAction<Array<string>>>;
  setProjectsSelected: React.Dispatch<React.SetStateAction<Array<string>>>;
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToHistoric: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToAdvancement: React.Dispatch<React.SetStateAction<boolean>>;
  setGoToTask: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [search, setSearch] = useState({
    title: "",
    member: "",
  });
  const [dataSorted, setDataSorted] = useState({
    title: 0,
    startDate: 0,
    endDate: 0,
    completionPercentage: 0,
    priority: 0,
    criticality: 0,
  });

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();
  // const userConnected = decodeToken("pr");

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getHab();
  }, []);

  useEffect(() => {
    setProjectSelected([]);
  }, [data]);

  const sortedData = data?.slice().sort((a: IProjectData, b: IProjectData) => {
    // sort by title
    if (dataSorted.title === 1) {
      return a.title.localeCompare(b.title);
    } else if (dataSorted.title === 2) {
      return b.title.localeCompare(a.title);
    }

    // sort by start date
    if (dataSorted.startDate === 1) {
      return a.startDate?.localeCompare(b.startDate ?? "") || 0;
    } else if (dataSorted.startDate === 2) {
      return b.startDate?.localeCompare(a.startDate ?? "") || 0;
    }

    //sort by end date
    if (dataSorted.endDate === 1) {
      if (a.endDate === null) return 1;
      if (b.endDate === null) return -1;
      return a.endDate?.localeCompare(b.endDate ?? "") || 0;
    } else if (dataSorted.endDate === 2) {
      if (a.endDate === null) return 1;
      if (b.endDate === null) return -1;
      return b.endDate?.localeCompare(a.endDate ?? "") || 0;
    }

    // sort by completion percentage
    if (dataSorted.completionPercentage === 1) {
      if (a.completionPercentage === undefined) return 1;
      if (b.completionPercentage === undefined) return -1;
      return a.completionPercentage - b.completionPercentage;
    } else if (dataSorted.completionPercentage === 2) {
      if (a.completionPercentage === undefined) return 1;
      if (b.completionPercentage === undefined) return -1;
      return b.completionPercentage - a.completionPercentage;
    }

    // sort by priority
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

    // sort by criticality
    const criticalityOrder: { [key: string]: number } = {
      "Moins urgente": 1,
      Urgente: 2,
      "Très urgente": 3,
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

  // filter data by title and member for the title search
  const filteredData = sortedData?.filter((item: IProjectData) => {
    const lowerCaseSearchTitle = search.title.toLowerCase();
    const lowerCaseSearchName = search.member.toLowerCase();

    return (
      item?.title.toLowerCase().includes(lowerCaseSearchTitle) &&
      item?.listUsers?.some((listUser) =>
        listUser?.user?.name?.toLowerCase().includes(lowerCaseSearchName)
      )
    );
  });

  // DELETE FILTER
  const handleDeleteFilter = () => {
    setSearch({
      ...search,
      title: "",
      member: "",
    });
  };

  // TO GET THE NUMBER OF PAGE DEPENDING OF THE ENTRIES PER PAGE
  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };

  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };

  // GET THE NUMBER OF PAGES EACH TIME A ENTRIES PER PAGE OR THE FILTEREDDATA CHANGE
  useEffect(() => {
    if (filteredData) {
      setPageNumbers(getPageNumber(filteredData.length));
    }
  }, [entriesPerPage, filteredData?.length]);

  const handleSelectAllProject = () => {
    if (data) {
      if (projectSelected.length < data.length) {
        setProjectSelected([]);
        data.map((p) => setProjectSelected((prev) => [...prev, p.id]));
        setIsAllSelected(true);
      } else {
        setProjectSelected([]);
        setIsAllSelected(false);
      }
    }
  };

  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* ===== FILTER START ===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
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
          <CustomInput
            type="text"
            value={search.member}
            label="Membres"
            placeholder="Rechercher"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                member: e.target.value,
              });
            }}
          />

          <div className="flex items-end pb-3 mx-2">
            <button
              onClick={handleDeleteFilter}
              className="flex justify-center gap-1 h-fit text-sm font-medium"
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
        </div>
      </div>
      {/* ===== FILTER END ===== */}
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
          Liste de tous les projets
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
      <div
        className={` mt-[-60px] border-primaryGreen border dark:border-formStrokedark  bg-white dark:bg-boxdark z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          projectSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div>
          {" "}
          {projectSelected.length === 1
            ? "1 élément séléctionné"
            : `${projectSelected.length} éléments séléctionnés`}{" "}
        </div>
        <div>
          <CustomSelect
            data={
              projectSelected.length > 1
                ? ["Archiver"].filter((action) => {
                    if (
                      myHabilitation?.project.delete == false &&
                      action === "Archiver"
                    ) {
                      return false;
                    }
                    return true;
                  })
                : [
                    "Modifier",
                    "Avancement",
                    "Gérer",
                    "Détail",
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
                    return true;
                  })
            }
            className="mb-2  "
            placeholder="Actions"
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
        </div>
      </div>
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full mb-4 overflow-x-auto ">
        <table className="w-full text-sm hidden md:table table-auto">
          {/* ===== TABLE HEAD START ===== */}
          <thead className="pt-5  rounded-t-xl bg-primaryGreen dark:bg-darkgreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className="pl-2">
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
                      projectSelected.length === filteredData?.length
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
                        title: dataSorted.title < 2 ? dataSorted.title + 1 : 0,
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
                          dataSorted.priority < 2 ? dataSorted.priority + 1 : 0,
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
                  <span>Equipes</span>
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
              <th className="py-4 px-4  font-bold text-white dark:text-white xl:pl-11">
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
            </tr>
          </thead>
          {/* ===== TABLE HEAD END ===== */}
          {/* ===== TABLE BODY START ===== */}
          <tbody>
            {!data ? (
              <tr>
                <td colSpan={9} className="py-9 content-center">
                  <div className="flex justify-center items-center">
                    <SyncLoader size={18} color={"teal"} />
                  </div>
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr className="hover:bg-whiten dark:hover:bg-boxdark2">
                <td colSpan={9} className="py-9 content-center ">
                  <div className="flex justify-center items-center">
                    Pas de projet
                  </div>
                </td>
              </tr>
            ) : (
              filteredData
                ?.filter((_project, index) => indexInPaginationRange(index))
                .map((project) => {
                  const dateStart = formatDate(project?.startDate);
                  const dateEnd = formatDate(project?.endDate);

                  // const userDetails = project.listUsers?.filter(
                  //   (user: { userid: string | undefined }) => {
                  //     return user?.userid === userConnected?.jti;
                  //   }
                  // );

                  return (
                    <tr
                      key={project?.id}
                      className="hover:bg-whiten dark:hover:bg-boxdark2"
                    >
                      <td className="pl-2">
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
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
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
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p
                          className={`  font-semibold rounded-md  text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.priority === "Moyenne"
                                ? "bg-orange3  text-orange dark:text-amber-100 dark:bg-orange2 "
                                : project?.priority === "Faible"
                                ? "bg-cyan-100 border border-cyan-100 text-cyan-700 dark:text-cyan-700 "
                                : project?.priority === "Elevée"
                                ? "bg-red-200 text-red-600 dark:text-red-600"
                                : ""
                            }
                            `}
                        >
                          {project?.priority}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p
                          className={` font-semibold rounded-md whitespace-nowrap text-center py-1 px-2 text-xs  w-fit
                            ${
                              project?.criticality === "Urgente"
                                ? "bg-orange3  text-orange dark:text-amber-100 dark:bg-orange2"
                                : "bg-cyan-100 border border-cyan-100 text-cyan-700 dark:text-cyan-700 "
                            }
                            `}
                        >
                          {project?.criticality}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <ListUsers data={project?.listUsers} type="director" />
                      </td>
                      <td className="border-b  gap-1 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <ListUsers data={project?.listUsers} type="all" />
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="text-black dark:text-white">
                          {dateStart}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="text-black dark:text-white">{dateEnd}</p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="text-black dark:text-white">
                          {project?.completionPercentage}%
                        </p>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
          {/* ===== TABLE BODY END ===== */}
        </table>

        {/* Mobile view */}
        <div className="block md:hidden">
          {filteredData
            ?.filter((_project, index) => indexInPaginationRange(index))
            .map((project) => {
              const dateStart = formatDate(project?.startDate);
              const dateEnd = formatDate(project?.endDate);

              return (
                <div
                  key={project?.id}
                  className="bg-white *:grid *:grid-cols-2 dark:bg-boxdark shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black"
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
                      Equipe :{" "}
                    </span>
                    <span className="text-gray-800">
                      <ListUsers data={project?.listUsers} type="all" />
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
                    <span className="text-gray-800">{dateEnd}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Avancement :{" "}
                    </span>
                    <span className="text-gray-800">
                      {project?.completionPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* =====PAGINATE START===== */}
      <div className="flex flex-col flex-wrap md:flex-row justify-end px-4 items-center">
        <div>
          <CustomSelect
            label="Par page : "
            data={["5", "10", "15", "20"]}
            placeholder="5"
            className="flex"
            value={entriesPerPage.toString()}
            onValueChange={(selectedValue) => {
              setEntriesPerPage(parseInt(selectedValue, 10));
            }}
          />
        </div>
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

export default TableProjet;
