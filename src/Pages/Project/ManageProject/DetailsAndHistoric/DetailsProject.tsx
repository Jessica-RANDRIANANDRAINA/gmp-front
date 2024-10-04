import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProjectData } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project/ProjectServices";
import ListUsers from "../../../../components/UIElements/ListUsers";

const DetailsProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState<IProjectData>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const fetchProjectData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
    }
  };

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

  useEffect(() => {
    fetchProjectData();
  }, []);
  return (
    <div className="grid md:grid-cols-2 gap-7  ">
      {/* ===== LEFT PART START */}
      <div className="space-y-8">
        {/* ===== INFO GENERAL START =====*/}
        <div className="space-y-2">
          <h1 className="font-bold  text-zinc-400 text-2xl ">
            INFORMATION GENERALE
          </h1>
          <div className="text-sm">
            <div className="flex flex-col space-y-1">
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
                      projectData?.criticality === "Moins urgente"
                        ? "text-cyan-500"
                        : projectData?.criticality === "Urgente"
                        ? "text-orange"
                        : "text-rose-600"
                    }`}
                  >
                    <span
                      className={`w-2 flex h-2 border rounded-full ${
                        projectData?.criticality === "Moins urgente"
                          ? "bg-cyan-500"
                          : projectData?.criticality === "Urgente"
                          ? "bg-orange"
                          : "bg-rose-600"
                      }`}
                    ></span>
                    {projectData?.criticality}
                  </div>
                </div>
              </div>
              {/* ----- team start ----- */}
              <div>
                <ListUsers data={projectData?.listUsers ?? []} type="all"/>
              </div>
              {/* ----- team start ----- */}

              {/* ----- DATE START ----- */}
              <div className="grid md:grid-cols-2">
                <div>
                  <span className="text-base">
                    <u>Début</u> :
                  </span>{" "}
                  {projectData?.startDate?.split("T")?.[0]}
                </div>
                <div className={`${projectData?.endDate ? "" : "hidden"}`}>
                  <span className="text-base">
                    <u>Fin</u> :{" "}
                  </span>
                  {projectData?.endDate?.split("T")?.[0]}
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
                      : `${projectData?.description?.substring(0, 200)}...`}
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(!isExpanded);
                      }}
                      className="ml-2 text-blue-400 text-xs  font-semibold hover:underline mt-2"
                    >
                      {isExpanded ? "Afficher moins" : "Afficher plus"}
                    </button>
                  </p>
                </div>
              </div>
              {/* ===== DESCRIPTION END ==== */}
            </div>
          </div>
        </div>
        {/* ===== INFO GENERAL END =====*/}

        {/* ===== RESSOURCE START =====*/}

        <div className="space-y-2">
          <h1 className="font-bold  text-zinc-400 text-2xl ">RESSOURCES </h1>
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
                                ? "bg-green-100 text-green-500"
                                : "bg-yellow-100 text-yellow-600"
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
                      <span className="text-gray-800">{ressource?.source}</span>
                    </div>
                    <div>
                      <span className="text-emerald-500 font-semibold">
                        État :{" "}
                      </span>
                      <span
                        className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          ressource?.type === "Disponible"
                            ? "bg-green-100 text-green-500"
                            : "bg-yellow-100 text-yellow-600"
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
                      <th className="py-3 px-6 text-left">Livrable attendu</th>
                      <th className="py-3 px-6 text-left">Date de début</th>
                      <th className="py-3 px-6 text-left">Date de fin</th>
                      <th className="py-3 px-6 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-xs font-light">
                    {projectData?.listPhases
                      ?.filter((phase) => phase?.rank !== undefined)
                      ?.slice()
                      ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                      ?.map((phases) => (
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
                              {phases?.startDate?.split("T")?.[0]}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <span className="text-gray-700 whitespace-nowrap">
                              {phases?.endDate?.split("T")?.[0]}
                            </span>
                          </td>
                          <td className="text-left ">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold  bg-green-100 text-green-500">
                              A faire
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {/* mobile view */}
                <div className="block md:hidden">
                  {projectData?.listPhases
                    ?.filter((phase) => phase?.rank !== undefined)
                    ?.slice()
                    ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                    ?.map((phases) => (
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
                            {phases?.startDate?.split("T"?.[0])}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-emerald-500 font-semibold">
                            Date de fin :{" "}
                          </span>
                          <span className="text-gray-800">
                            {phases?.endDate?.split("T")?.[0]}
                          </span>
                        </div>
                        <div>
                          <span className="text-emerald-500 font-semibold">
                            Status :{" "}
                          </span>
                          <span
                            className={`inline-flex w-fit whitespace-nowrap items-center px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          phases?.status === "A faire"
                            ? "bg-green-100 text-green-500"
                            : "bg-yellow-100 text-yellow-600"
                        }
                        `}
                          >
                            {/* {phases.type} */}A faire
                          </span>
                        </div>
                      </div>
                    ))}
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
  );
};

export default DetailsProject;
