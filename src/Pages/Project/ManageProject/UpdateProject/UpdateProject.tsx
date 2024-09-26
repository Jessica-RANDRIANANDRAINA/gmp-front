import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CustomInput,
  CutomInputUserSearch,
} from "../../../../components/UIElements";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
  IHistoricProject,
} from "../../../../types/Project";
import { getAllDepartments } from "../../../../services/User";
import {
  updateProject,
  getProjectById,
} from "../../../../services/Project/ProjectServices";
import { decodeToken } from "../../../../services/Function/TokenService";
import { getInitials } from "../../../../services/Function/UserFunctionService";
import { InfoGeneralUpdate, BudgetAndRessourcesUpdate } from "./subPages";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { v4 as uuid4 } from "uuid";
import { PuffLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectDataToModif, setProjectDataToModif] = useState<IProjectData>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [allDataIsLoaded, setAllDataIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState<IProjectData>({
    id: "",
    title: "",
    completionPercentage: 0,
    description: "",
    priority: "Moyenne",
    beneficiary: "",
    initiator: "",
    startDate: undefined,
    endDate: undefined,
    isEndDateImmuable: false,
    listBudgets: [],
    listRessources: [],
    listPhases: [],
    listUsers: [],
    listHistoricProjects: [],
    idBudget: "",
    codeBuget: "",
    directionSourceBudget: "",
    budgetAmount: null,
    budgetCurrency: "MGA",
  });
  const [ressourceList, setRessourceList] = useState<Array<IRessource>>([]);
  const [phaseAndLivrableList, setPhaseAndLivrableList] = useState<
    Array<IPhase>
  >([]);
  const [directionOwner, setDirectionOwner] = useState<string[]>([]);
  const [hitoricProjectDate, setHistoricProjectDate] =
    useState<IHistoricProject>({
      id: "",
      initiator: "",
      elementChanged: "",
      from: "",
      to: "",
      reason: "",
    });
  const [pageCreate, setPageCreate] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);
  const [userTeam, setUserTeam] = useState<
    { id: string | undefined; name: string; email: string; role: string }[]
  >([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [haveBudget, setHaveBudget] = useState(false);

  // ==========================================

  const fetchDataProject = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectDataToModif(project);
    }
  };

  useEffect(() => {
    fetchDataProject();
  }, []);

  useEffect(() => {
    if (projectDataToModif) {
      setProjectData({
        id: projectDataToModif?.id,
        title: projectDataToModif?.title,
        completionPercentage: projectDataToModif?.completionPercentage,
        description: projectDataToModif?.description,
        priority: projectDataToModif?.priority,
        beneficiary: "",
        initiator: projectDataToModif?.initiator,
        startDate: projectDataToModif?.startDate,
        endDate: projectDataToModif?.endDate,
        isEndDateImmuable: projectDataToModif?.isEndDateImmuable,
        listBudgets: [],
        listRessources: [],
        listPhases: [],
        listUsers: [],
        listHistoricProjects: [],
        idBudget: projectDataToModif?.listBudgets?.[0]?.id,
        codeBuget: projectDataToModif?.listBudgets?.[0]?.code,
        directionSourceBudget: projectDataToModif?.listBudgets?.[0]?.direction,
        budgetAmount: projectDataToModif?.listBudgets?.[0]?.amount,
        budgetCurrency: projectDataToModif?.listBudgets?.[0]?.currency ?? "MGA",
      });

      const ressourceData: IRessource[] = [];
      const phaseData: IPhase[] = [];
      const team = [];
      if (projectDataToModif?.listBudgets?.length > 0) {
        setHaveBudget(true);
      }
      if (projectDataToModif?.listRessources?.length > 0) {
        for (let i = 0; i < projectDataToModif.listRessources.length; i++) {
          ressourceData.push({
            id: projectDataToModif.listRessources[i]?.id,
            ressource: projectDataToModif.listRessources[i]?.ressource,
            source: projectDataToModif.listRessources[i]?.source,
            type: projectDataToModif.listRessources[i]?.type,
          });
        }
        setRessourceList(ressourceData);
      }
      if (projectDataToModif?.listPhases?.length > 0) {
        for (let i = 0; i < projectDataToModif.listPhases.length; i++) {
          phaseData.push({
            id: projectDataToModif.listPhases[i]?.id,
            phase1: projectDataToModif.listPhases[i]?.phase1,
            rank: projectDataToModif.listPhases[i]?.rank,
            expectedDeliverable:
              projectDataToModif.listPhases[i]?.expectedDeliverable,
            startDate: projectDataToModif.listPhases[i]?.startDate,
            endDate: projectDataToModif.listPhases[i]?.endDate,
          });
        }
        setPhaseAndLivrableList(phaseData);
      }
      if (projectDataToModif?.listUsers?.length > 0) {
        for (let i = 0; i < projectDataToModif.listUsers.length; i++) {
          team.push({
            id: projectDataToModif.listUsers[i]?.userid,
            name: projectDataToModif.listUsers[i]?.user?.name,
            email: projectDataToModif.listUsers[i]?.user?.email,
            role: projectDataToModif.listUsers[i]?.role,
          });
        }
        setUserTeam(team);
      }
      setAllDataIsLoaded(true);
    }
  }, [projectDataToModif]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // GET ALL DEPARTEMENTS
  useEffect(() => {
    const fetchDepartment = async () => {
      const depart = await getAllDepartments();
      setDepartments(depart);
    };
    fetchDepartment();
  }, []);

  // ADD PHASE IN THE LIST
  const handleAddPhaseList = () => {
    let phaseData: IPhase = {
      id: uuid4(),
      phase1: "",
      expectedDeliverable: "",
      startDate: undefined,
      endDate: undefined,
    };
    setPhaseAndLivrableList([...phaseAndLivrableList, phaseData]);
  };

  // ADD DEFAULT VALUE IN PHASE LIST
  const handleAddDefaultPhaseList = () => {
    let phaseData: IPhase[] = [
      {
        // id: uuid4(),
        rank: 0,
        phase1: "Conception",
        expectedDeliverable: "Document de cadrage",
      },
      {
        // id: uuid4(),
        rank: 1,
        phase1: "Réalisation",
        expectedDeliverable: "Signature de mise en production",
      },
      {
        // id: uuid4(),
        rank: 2,
        phase1: "Mise en production",
        expectedDeliverable: "Plan de déploiement",
      },
      {
        // id: uuid4(),
        rank: 3,
        phase1: "Clôture et maintenance",
        expectedDeliverable: "PV de recette",
      },
    ];
    setPhaseAndLivrableList(phaseData);
  };

  // REMOVE A PHASE TO THE LIST
  const handleRemovePhaseList = (phase1: string) => {
    let filteredList = phaseAndLivrableList.filter(
      (phase) => phase.phase1 !== phase1
    );
    setPhaseAndLivrableList(filteredList);
  };

  // REMOVE A USER FROM TEAM LIST
  const handleRemoveTeamList = (id: string | undefined) => {
    let filteredList = userTeam.filter((team) => team.id !== id);
    setUserTeam(filteredList);
  };

  const handlePhaseDataChange = (
    label: string,
    value: string,
    index: number
  ) => {
    setPhaseAndLivrableList((prevList) =>
      prevList.map((phase, idx) =>
        idx === index
          ? {
              ...phase,
              [label === "phase"
                ? "phase1"
                : label === "livrable"
                ? "expectedDeliverable"
                : label === "startDate"
                ? "startDate"
                : "endDate"]: value,
            }
          : phase
      )
    );
  };

  // update project
  const handleUpdateProject = async () => {
    setIsCreateLoading(true);
    const projectid = uuid4();
    // trnasform the benefiary from an array to a string
    const beneficiary = directionOwner?.join(", ");
    // initilize budget data
    var budgetData: IBudget[] = [];
    // get the data of the user connected
    const userConnected = decodeToken("pr");

    // if there is budget, add it in budgetData
    if (
      projectData.budgetAmount !== 0 &&
      projectData.budgetAmount !== undefined
    ) {
      budgetData = [
        {
          id: projectData?.idBudget ?? uuid4(),
          code: projectData?.codeBuget,
          direction: projectData?.directionSourceBudget,
          amount: projectData?.budgetAmount ?? 0,
          currency: projectData?.budgetCurrency,
        },
      ];
    } else {
      budgetData = [];
    }

    var historic: IHistoricProject[] = [];
    if (hitoricProjectDate?.reason !== "") {
      historic = [
        {
          id: uuid4(),
          initiator: userConnected?.jti,
          elementChanged: "endDate",
          from: projectDataToModif?.endDate ?? "",
          to: projectData.endDate,
          reason: hitoricProjectDate?.reason,
        },
      ];
    } else {
      historic = [];
    }

    // if there is team members, map them and store in userProject
    const userProject = userTeam?.map((team) => ({
      userid: team.id,
      projectid: projectid,
      role: team?.role,
    }));

    // trenasform all the data to a single object
    const data = {
      ...projectData,
      isEndDateImmuable: projectData?.isEndDateImmuable ? 1 : 0,
      initiator: userConnected?.name,
      beneficiary: beneficiary,
      listBudgets: budgetData,
      listRessources: ressourceList,
      listPhases: phaseAndLivrableList,
      listUsers: userProject,
      listHistoricProjects: historic,
    };
    console.log(data);

    try {
      // update project service
      await updateProject(data?.id, data);
    } catch (error) {
      console.log(`Error at create project: ${error}`);
    } finally {
      // stop loading
      setIsCreateLoading(false);
      // close modal
      navigate("/gmp/project/list");
    }
  };

  return (
    <ProjectLayout>
      <div className="text-sm mx-2 p-4 md:mx-10 ">
        {/* ===== LINK RETURN START ===== */}
        <div className={`w-full  mb-2 flex  items-center `}>
          <button
            onClick={() => {
              navigate("/gmp/project/list");
            }}
            className={`md:w-fit gap-2  w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90 md:ease-out md:duration-300 md:transform   ${
              isLoaded ? "md:translate-x-0 " : "md:translate-x-[60vw]"
            }`}
          >
            retour
          </button>
        </div>
        {/* ===== LINK RETURN END ===== */}
        {/* ===== BLOC UPDATE PROJECT START ===== */}
        <div className=" bg-white relative  overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-3  rounded-md dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
          {/* ===== LOADING START ===== */}
          <div
            className={`justify-center items-center h-full ${
              allDataIsLoaded ? "hidden" : "flex"
            }`}
          >
            loading . . .
          </div>
          {/* ===== LOADING END ===== */}
          <div
            className={` flex-col items-center ${
              allDataIsLoaded ? "flex" : "hidden"
            }`}
          >
            {/* ===== ADVANCEMENT STEP MENUE START ===== */}
            <div className="absolute my-2 ml-2 top-0 left-0 space-y-3 md:block hidden">
              <div
                onClick={() => setPageCreate(1)}
                className={`border p-2 border-slate-200 tranform duration-500 ease-linear cursor-pointer
               ${pageCreate === 1 ? "bg-amber-200" : ""}
               
               `}
              >
                Info générale
              </div>
              <div
                onClick={() => {
                  if (
                    projectData?.title === "" ||
                    projectData?.startDate === undefined ||
                    projectData?.startDate === "" ||
                    directionOwner?.length === 0
                  ) {
                    return;
                  }
                  setPageCreate(2);
                }}
                className={`border p-2 border-slate-200 tranform duration-500 ease-linear  ${
                  pageCreate === 2 ? "bg-amber-200" : ""
                } 
            ${
              projectData?.title === "" ||
              projectData?.startDate === undefined ||
              projectData?.startDate === "" ||
              directionOwner?.length === 0
                ? "cursor-default opacity-70"
                : "cursor-pointer"
            }
            `}
              >
                Budget et ressources
              </div>
              <div
                onClick={() => {
                  if (
                    projectData?.title === "" ||
                    projectData?.startDate === undefined ||
                    projectData?.startDate === "" ||
                    directionOwner?.length === 0
                  ) {
                    return;
                  }
                  setPageCreate(3);
                }}
                className={`border p-2 border-slate-200 tranform duration-500 ease-linear ${
                  pageCreate === 3 ? "bg-amber-200" : ""
                } 
            ${
              projectData?.title === "" ||
              projectData?.startDate === undefined ||
              projectData?.startDate === "" ||
              directionOwner?.length === 0
                ? "cursor-default opacity-70"
                : "cursor-pointer"
            }
            `}
              >
                Phases et livrables
              </div>
              <div
                onClick={() => {
                  if (
                    projectData?.title === "" ||
                    projectData?.startDate === undefined ||
                    projectData?.startDate === "" ||
                    directionOwner?.length === 0
                  ) {
                    return;
                  }
                  setPageCreate(4);
                }}
                className={`border p-2 border-slate-200 tranform duration-500 ease-linear ${
                  pageCreate === 4 ? "bg-amber-200" : ""
                }
            ${
              projectData?.title === "" ||
              projectData?.startDate === undefined ||
              projectData?.startDate === "" ||
              directionOwner?.length === 0
                ? "cursor-default opacity-70"
                : "cursor-pointer"
            } `}
              >
                Equipe
              </div>
            </div>

            {/* ===== ADVANCEMENT STEP MENUE END ===== */}
            <span className="font-bold tracking-widest text-lg   ">
              Modifier le projet
            </span>
            {/* ===== FORM CREATE START ===== */}
            <div className="pt-2 md:w-1/2  ">
              {/* ===== CREATE PROJECT LEVEL ONE START INFO GENERAL ===== */}

              <InfoGeneralUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                projectData={projectData}
                setProjectData={setProjectData}
                departments={departments}
                setDirectionOwner={setDirectionOwner}
                setHistoricProjectDate={setHistoricProjectDate}
                hitoricProjectDate={hitoricProjectDate}
                projectDataToModif={projectDataToModif}
              />

              {/* ===== CREATE PROJECT LEVEL ONE END INFO GENERAL ===== */}

              {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE START ===== */}

              <BudgetAndRessourcesUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                haveBudget={haveBudget}
                setHaveBudget={setHaveBudget}
                projectData={projectData}
                setProjectData={setProjectData}
                departments={departments}
                ressourceList={ressourceList}
                setRessourceList={setRessourceList}
              />

              {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE END ===== */}
              {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE START ===== */}
              <form
                className={`space-y-2 transition-all duration-1000 ease-in-out ${
                  pageCreate === 3
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden"
                }`}
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  if (form.reportValidity()) {
                    if (phaseAndLivrableList.length > 0) {
                      setPageCreate(4);
                    } else {
                      notyf.error("Un projet doit contenir au moins une phase");
                    }
                  }
                }}
              >
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold tracking-wide underline">
                      PHASES ET LIVRABLES
                    </span>
                    <div className="hide-scrollbar overflow-y-scroll md:max-h-125 md:min-h-125">
                      <button
                        onClick={handleAddDefaultPhaseList}
                        type="button"
                        className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke`}
                      >
                        Utiliser les valeurs par défaut
                      </button>
                      {phaseAndLivrableList
                        ?.filter((phase) => phase?.rank !== undefined)
                        ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                        ?.map((phase, index) => (
                          <div key={phase?.id}>
                            <div className={"flex justify-between"}>
                              <div className={"underline"}>
                                Phase {index + 1}
                              </div>
                              <button
                                type="button"
                                className={
                                  "text-red-500 decoration-red-500 font-bold hover:font-black"
                                }
                                onClick={() => {
                                  handleRemovePhaseList(phase.phase1);
                                }}
                              >
                                Supprimer
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <CustomInput
                                label="Phase"
                                type="text"
                                rounded="medium"
                                placeholder="Ex: conception"
                                value={phase?.phase1}
                                onChange={(e) => {
                                  handlePhaseDataChange(
                                    "phase",
                                    e.target.value,
                                    index
                                  );
                                }}
                                required
                              />
                              <CustomInput
                                label="Livrable(s)"
                                type="text"
                                rounded="medium"
                                placeholder="Ex: dossier de conception"
                                value={phase?.expectedDeliverable}
                                onChange={(e) => {
                                  handlePhaseDataChange(
                                    "livrable",
                                    e.target.value,
                                    index
                                  );
                                }}
                                required
                              />
                              <CustomInput
                                label="Date début"
                                type="date"
                                rounded="medium"
                                value={
                                  phase?.startDate
                                    ? phase?.startDate?.split("T")[0]
                                    : 0
                                }
                                onChange={(e) => {
                                  handlePhaseDataChange(
                                    "startDate",
                                    e.target.value,
                                    index
                                  );
                                }}
                              />
                              <CustomInput
                                label="Date fin"
                                type="date"
                                rounded="medium"
                                value={
                                  phase?.endDate
                                    ? phase?.endDate?.split("T")[0]
                                    : 0
                                }
                                onChange={(e) => {
                                  handlePhaseDataChange(
                                    "endDate",
                                    e.target.value,
                                    index
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      <button
                        type="button"
                        onClick={handleAddPhaseList}
                        className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke`}
                      >
                        Ajouter une phase
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setPageCreate(2)}
                      className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                    >
                      Précédent
                    </button>
                    <button
                      // onClick={() => setPageCreate(4)}
                      type="submit"
                      className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </form>
              {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE END ===== */}
              {/* ===== CREATE PROJECT LEVEL FOUR: TEAM START ===== */}
              <div
                className={`space-y-2 transition-all duration-1000 ease-in-out ${
                  pageCreate === 4
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold tracking-wide underline">
                      EQUIPES
                    </span>
                    <div className="space-y-2">
                      {/* ===== PROJECT DIRECTOR START ===== */}
                      <div>
                        <div>Directeur de projet</div>
                        <div className="hide-scrollbar">
                          <CutomInputUserSearch
                            placeholder="Recherche"
                            label="Assigner"
                            userSelected={userTeam}
                            setUserSelected={setUserTeam}
                            role="director"
                          />
                          <div className="flex gap-4 mt-2 flex-wrap">
                            {userTeam
                              ?.filter((team) => team.role === "director")
                              ?.map((team) => {
                                const initials = getInitials(team.name);
                                return (
                                  <div
                                    key={team.id}
                                    className="relative group -ml-2 first:ml-0 hover:z-50"
                                    onClick={() => {
                                      handleRemoveTeamList(team.id);
                                    }}
                                  >
                                    <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                                      {initials}
                                    </p>
                                    <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                                      <p>{team?.name}</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      {/* ===== PROJECT DIRECTOR END ===== */}
                      {/* ===== PROJECT TEAM START ===== */}
                      <div>
                        <div>Equipes</div>
                        <div className="hide-scrollbar">
                          <CutomInputUserSearch
                            placeholder="Recherche"
                            label="Assigner"
                            userSelected={userTeam}
                            setUserSelected={setUserTeam}
                            role="member"
                          />
                          <div className="flex gap-4 mt-2 flex-wrap">
                            {userTeam
                              ?.filter((team) => team.role === "member")
                              ?.map((team) => {
                                const initials = getInitials(team.name);
                                return (
                                  <div
                                    key={team.id}
                                    className="relative group -ml-2 first:ml-0 hover:z-50"
                                    onClick={() => {
                                      handleRemoveTeamList(team.id);
                                    }}
                                  >
                                    <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                                      {initials}
                                    </p>
                                    <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                                      <p>{team?.name}</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      {/* ===== PROJECT TEAM END ===== */}
                      {/* ===== PROJECT OBSERVATOR START ===== */}
                      <div>
                        <div>Observateur</div>
                        <div className="hide-scrollbar">
                          <CutomInputUserSearch
                            placeholder="Recherche"
                            label="Assigner"
                            userSelected={userTeam}
                            setUserSelected={setUserTeam}
                            role="observator"
                          />
                          <div className="flex gap-4 mt-2 flex-wrap">
                            {userTeam
                              ?.filter((team) => team.role === "observator")
                              ?.map((team) => {
                                const initials = getInitials(team.name);
                                return (
                                  <div
                                    key={team.id}
                                    className="relative group -ml-2 first:ml-0 hover:z-50"
                                    onClick={() => {
                                      handleRemoveTeamList(team.id);
                                    }}
                                  >
                                    <p className=" cursor-pointer text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white">
                                      {initials}
                                    </p>
                                    <div className="absolute whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-10 top-[-35px] left-1/2 transform -translate-x-1/2">
                                      <p>{team?.name}</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      {/* ===== PROJECT OBSERVATOR END ===== */}
                    </div>
                  </div>
                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => setPageCreate(3)}
                      className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleUpdateProject}
                      className="md:w-fit gap-2 w-full flex cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                    >
                      {isCreateLoading && (
                        <span>
                          <PuffLoader size={20} className="mr-2" />
                        </span>
                      )}
                      Modifier le projet
                    </button>
                  </div>
                </div>
              </div>
              {/* ===== CREATE PROJECT LEVEL FOUR: TEAM END ===== */}
            </div>
            {/* ===== FORM CREATE END ===== */}
          </div>
        </div>
        {/* ===== BLOC UPDATE PROJECT END ===== */}
      </div>
    </ProjectLayout>
  );
};

export default UpdateProject;
