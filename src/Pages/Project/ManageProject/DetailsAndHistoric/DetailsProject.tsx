import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProjectData } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project";
import { formatDate } from "../../../../services/Function/DateServices";

const DetailsProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState<IProjectData>();
  const [isDateEndPassed, setIsEndPassed] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const fetchProjectData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      const today = new Date();
      const dateEndCheck = new Date(project?.endDate);
      const isEndDatePassed =
        dateEndCheck < today && project?.completionPercentage !== 100;
      setIsEndPassed(isEndDatePassed);
      setProjectData(project);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <div className="grid place-items-center">
      DU : {new Date().toLocaleString()}
      <div className="space-y-10  md:w-2/3  ">
        {/* ===== LEFT PART START */}
        <div className="space-y-8">
          {/* ===== INFO GENERAL START =====*/}
          <div className="space-y-2">
            <h1 className="font-bold  text-zinc-400 text-2xl ">
              INFORMATION GENERALE
            </h1>
            <div className="text-sm">
              <div className="flex flex-col space-y-3">
                <div className="font-semibold  text-lg flex flex-wrap mb-3">
                  <div className="mr-3">
                    <span>{projectData?.title}</span>
                  </div>
                  <div className="space-x-1 flex flex-wrap">
                    {projectData?.beneficiary?.split(",")?.map((benef) => (
                      <span
                        key={benef}
                        className="text-sm font-light border p-1 rounded-md text-zinc-400 "
                      >
                        {benef}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base flex">
                      <u>Avancement</u> :
                    </div>
                    <div className="w-1/3 bg-zinc-100 rounded-full dark:bg-strokedark h-4 relative ml-4">
                      <div
                        className={`h-4 rounded-full ${
                          projectData?.completionPercentage === 0
                            ? "bg-red-500"
                            : projectData?.completionPercentage === 25
                            ? "bg-orange"
                            : projectData?.completionPercentage === 50
                            ? "bg-amber-500"
                            : projectData?.completionPercentage === 75
                            ? "bg-lime-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${projectData?.completionPercentage}%`,
                        }}
                      ></div>
                      <span className="absolute inset-0 flex justify-center items-center text-black dark:text-white text-xs font-semibold">
                        {projectData?.completionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2">
                  <div className="flex gap-2">
                    <span className="text-base">
                      <u>Priorité</u> :{" "}
                    </span>
                    <div
                      className={`text-sm flex justify-center items-center gap-1 ${
                        projectData?.priority === "Faible"
                          ? "text-cyan-500"
                          : projectData?.priority === "Moyenne"
                          ? "text-orange"
                          : "text-rose-600"
                      }`}
                    >
                      <span
                        className={`w-2 flex h-2 border rounded-full ${
                          projectData?.priority === "Faible"
                            ? "bg-cyan-500"
                            : projectData?.priority === "Moyenne"
                            ? "bg-orange"
                            : "bg-rose-600"
                        }`}
                      ></span>
                      {projectData?.priority}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base">
                      <u>Criticité</u> :{" "}
                    </span>
                    <div
                      className={`text-sm flex justify-center items-center gap-1 ${
                        projectData?.criticality === "Normale"
                          ? "text-cyan-500"
                          : "text-orange"
                      }`}
                    >
                      <span
                        className={`w-2 flex h-2 border rounded-full ${
                          projectData?.criticality === "Normale"
                            ? "bg-cyan-500"
                            : "bg-orange"
                        }`}
                      ></span>
                      {projectData?.criticality}
                    </div>
                  </div>
                </div>
                {/* ----- team start ----- */}
                <div className="">
                  <div className="text-base">
                    <u>
                      <span className="uppercase">é</span>quipe
                    </u>{" "}
                    :
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 whitespace-nowrap gap-1">
                    {projectData?.listUsers?.map((user) => (
                      <div className="">
                        <p className="text-xs">{user?.user?.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ----- team start ----- */}

                {/* ----- DATE START ----- */}
                <div className="grid md:grid-cols-2">
                  <div>
                    <span className="text-base">
                      <u>Début</u> :
                    </span>{" "}
                    {projectData?.startDate
                      ? formatDate(projectData?.startDate)
                      : ""}
                  </div>
                  <div
                    className={`${
                      projectData?.endDate ? "flex gap-2" : "hidden"
                    }`}
                  >
                    <span className="text-base">
                      <u>Fin</u> :{" "}
                    </span>
                    <span className="flex gap-1 text-red-500">
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
                      {projectData?.endDate
                        ? formatDate(projectData?.endDate)
                        : ""}
                      {isDateEndPassed ? " - En retard" : ""}
                    </span>
                  </div>
                </div>
                {/* ----- DATE END ----- */}
                {/* ----- BUDGET START ----- */}
                <div
                  className={` md:grid-cols-2 ${
                    projectData?.listBudgets?.[0]?.amount ? "grid" : "hidden"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {" "}
                      <u>Budget</u> :{" "}
                    </span>
                    <span className="text-sm font-light border p-1 rounded-md text-zinc-400 ">
                      {projectData?.listBudgets?.[0]?.direction}
                    </span>{" "}
                    <div>
                      <span className="mr-2">
                        {projectData?.listBudgets?.[0]?.code}
                      </span>
                      <span>{projectData?.listBudgets?.[0]?.amount}</span>
                      <span>
                        {projectData?.listBudgets?.[0]?.currency === "EUR"
                          ? "€"
                          : "Ar"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* ===== BUDGET END ===== */}
                {/* ===== DESCRIPTION START ==== */}
                <div
                  className={` flex-col ${
                    projectData?.description ? "flex" : "hidden"
                  }`}
                >
                  <span className="text-base">
                    <u>Description</u> :{" "}
                  </span>
                  <div className="text-justify text-sm">
                    <p>
                      {/* {projectData?.description} */}
                      {isExpanded
                        ? `${projectData?.description}`
                        : `${projectData?.description?.substring(0, 200)}`}
                      <span
                        className={`${
                          projectData?.description &&
                          projectData?.description.length > 200
                            ? ""
                            : "hidden"
                        }`}
                      >
                        {" "}
                        ...
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpanded(!isExpanded);
                          }}
                          className={`ml-2 text-blue-400 text-xs  font-semibold hover:underline mt-2 `}
                        >
                          {isExpanded ? "Afficher moins" : "Afficher plus"}
                        </button>
                      </span>
                    </p>
                  </div>
                </div>
                {/* ===== DESCRIPTION END ==== */}
              </div>
            </div>
          </div>
          {/* ===== INFO GENERAL END =====*/}

          {/* ===== RESSOURCE START =====*/}
          {projectData?.listRessources &&
          projectData?.listRessources?.length > 0 ? (
            <div className="space-y-2">
              <h1 className="font-bold  text-zinc-400 text-2xl ">
                RESSOURCES{" "}
              </h1>
              <div className="md:border border-zinc-200 dark:border-black rounded-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-white dark:bg-boxdark shadow-lg rounded-lg hidden md:table">
                    <thead className="bg-gray-100 border-b border-b-zinc-300 dark:border-b-black text-gray-600 uppercase text-sm leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Ressource</th>
                        <th className="py-3 px-6 text-left">Source</th>
                        <th className="py-3 px-6 text-center">État</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs font-light">
                      {projectData?.listRessources?.map((ressource) => (
                        <tr
                          key={ressource?.id}
                          className="border-b border-zinc-200 hover:bg-zinc-50 dark:hover:bg-black dark:border-black hover:bg-gray-50 transition-colors duration-300"
                        >
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">
                                {ressource?.ressource}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <span className="text-gray-700">
                              {ressource?.source}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                            ${
                              ressource?.type === "Disponible"
                                ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                : "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                            } `}
                            >
                              {ressource?.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile view */}
                  <div className="block md:hidden">
                    {projectData?.listRessources?.map((ressource) => (
                      <div
                        key={ressource?.id}
                        className="bg-white *:grid *:grid-cols-2 dark:bg-boxdark shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black"
                      >
                        <div className="mb-2">
                          <span className="text-emerald-500 font-semibold">
                            Ressource :{" "}
                          </span>
                          <span className="text-gray-800">
                            {ressource?.ressource}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-emerald-500 font-semibold">
                            Source :{" "}
                          </span>
                          <span className="text-gray-800">
                            {ressource?.source}
                          </span>
                        </div>
                        <div>
                          <span className="text-emerald-500 font-semibold">
                            État :{" "}
                          </span>
                          <span
                            className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          ressource?.type === "Disponible"
                            ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                            : "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                        }
                        `}
                          >
                            {ressource?.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* ===== RESSOURCE END =====*/}
        </div>
        {/* ===== LEFT PART END */}
        {/* ===== RIGHT PART START */}
        <div className="space-y-2">
          {/* ---- phase start ---- */}
          <div className="space-y-2">
            <h1 className="font-bold  text-zinc-400 text-2xl ">PHASES</h1>
            <div className="text-sm">
              {/* ----- table phase start ----- */}
              <div className="md:border border-zinc-200 dark:border-black rounded-md">
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-white dark:bg-boxdark shadow-lg rounded-lg hidden md:table">
                    <thead className="bg-gray-100 border-b border-b-zinc-300 dark:border-b-black text-gray-600 uppercase text-sm leading-normal">
                      <tr>
                        <th className="py-3 px-6 text-left">Titre</th>
                        <th className="py-3 px-6 text-left">
                          Livrable attendu
                        </th>
                        <th className="py-3 px-6 text-left">Date de début</th>
                        <th className="py-3 px-6 text-left">Date de fin</th>
                        <th className="py-3 px-6 text-left">
                          Lien du livrable
                        </th>
                        <th className="py-3 px-6 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs font-light">
                      {projectData?.listPhases
                        ?.filter((phase) => phase?.rank !== undefined)
                        ?.slice()
                        ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                        ?.map((phases) => {
                          const startDatePhase = phases?.startDate
                            ? formatDate(phases?.startDate)
                            : "";
                          const endDatePhase = phases?.endDate
                            ? formatDate(phases?.endDate)
                            : "";
                          return (
                            <tr
                              key={phases?.id}
                              className="border-b border-zinc-200 hover:bg-zinc-50 dark:hover:bg-black dark:border-black hover:bg-gray-50 transition-colors duration-300"
                            >
                              <td className="py-3 px-6 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {phases?.phase1}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-left">
                                <span className="text-gray-700">
                                  {phases?.expectedDeliverable}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-left">
                                <span className="text-gray-700 whitespace-nowrap">
                                  {startDatePhase}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-left">
                                <span className="text-gray-700 whitespace-nowrap">
                                  {endDatePhase}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-left">
                                <span className="text-gray-700 whitespace-nowrap">
                                  {phases?.deliverable && (
                                    <a
                                      href={phases?.deliverable}
                                      className="border p-1 rounded-md cursor-pointer bg-white border-zinc-200 hover:bg-zinc-100 dark:bg-boxdark dark:hover:bg-boxdark2 dark:border-formStrokedark "
                                    >
                                      Le lien
                                    </a>
                                  )}
                                </span>
                              </td>
                              <td className="text-left ">
                                <span
                                  className={`inline-flex space-x-1 items-center px-3 py-1 rounded-full text-xs font-semibold   ${
                                    phases?.status === "Terminé"
                                      ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                      : phases?.status === "En cours"
                                      ? "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                                      : "bg-cyan-100 text-cyan-600 border-cyan-300  dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700"
                                  }`}
                                >
                                  <span
                                    className={`${
                                      phases?.status === "Terminé"
                                        ? ""
                                        : "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        strokeWidth="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                          d="M4 12.6111L8.92308 17.5L20 6.5"
                                          className="stroke-green-500"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></path>{" "}
                                      </g>
                                    </svg>
                                  </span>
                                  <span>{phases?.status ?? "A faire"}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {/* mobile view */}
                  <div className="block md:hidden">
                    {projectData?.listPhases
                      ?.filter((phase) => phase?.rank !== undefined)
                      ?.slice()
                      ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                      ?.map((phases) => {
                        const startDatePhase = phases?.startDate
                          ? formatDate(phases?.startDate)
                          : "";
                        const endDatePhase = phases?.endDate
                          ? formatDate(phases?.endDate)
                          : "";

                        return (
                          <div
                            key={phases?.id}
                            className="bg-white *:grid *:grid-cols-2 dark:bg-boxdark shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black"
                          >
                            <div className="mb-2">
                              <span className="text-emerald-500 font-semibold">
                                Titre :{" "}
                              </span>
                              <span className="text-gray-800">
                                {phases?.phase1}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span className="text-emerald-500 font-semibold">
                                Livrable attendu :{" "}
                              </span>
                              <span className="text-gray-800">
                                {phases?.expectedDeliverable}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span className="text-emerald-500 font-semibold">
                                Date de début :{" "}
                              </span>
                              <span className="text-gray-800">
                                {/* {phases?.startDate?.split("T"?.[0])} */}
                                {startDatePhase}
                              </span>
                            </div>
                            <div className="mb-2">
                              <span className="text-emerald-500 font-semibold">
                                Date de fin :{" "}
                              </span>
                              <span className="text-gray-800">
                                {endDatePhase}
                              </span>
                            </div>
                            <div>
                              <span className="text-emerald-500 font-semibold">
                                Status :{" "}
                              </span>
                              <span
                                className={`inline-flex space-x-1 w-fit whitespace-nowrap items-center px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          phases?.status === "Terminé"
                            ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                            : phases?.status === "En cours"
                            ? "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                            : "bg-cyan-100 text-cyan-600 border-cyan-300  dark:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-700"
                        }
                        `}
                              >
                                <span
                                  className={`${
                                    phases?.status === "Terminé" ? "" : "hidden"
                                  }`}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M4 12.6111L8.92308 17.5L20 6.5"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>{" "}
                                    </g>
                                  </svg>
                                </span>
                                <span>{phases.status ?? "A faire"}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {/* ----- table phase end ----- */}
            </div>
          </div>
          {/* ---- phase end ---- */}
        </div>
        {/* ===== RIGHT PART END */}
      </div>
    </div>
  );
};

export default DetailsProject;
