import { useEffect, useState } from "react";
import {
  CutomInputUserSearch,
} from "../../../../components/UIElements";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
} from "../../../../types/Project";
import { getAllDepartments } from "../../../../services/User";
import { createProject } from "../../../../services/Project/ProjectServices";
import { decodeToken } from "../../../../services/Function/TokenService";
import { v4 as uuid4 } from "uuid";
import { PuffLoader } from "react-spinners";
import { getInitials } from "../../../../services/Function/UserFunctionService";
import { InfoGeneralAdd, BudgetAndRessourceAdd, PhasesAdd } from "./subPages";

const AddProject = ({ setIsAddProject }: { setIsAddProject: Function }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState<IProjectData>({
    id: "",
    title: "",
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
    codeBuget: "",
    directionSourceBudget: "",
    budgetAmount: null,
    budgetCurrency: "MGA",
  });
  const [ressourceList, setRessourceList] = useState<Array<IRessource>>([]);
  const [phaseAndLivrableList, setPhaseAndLivrableList] = useState<
    Array<IPhase>
  >([]);
  const [directionOwner, setDirectionOwner] = useState<any>();
  const [pageCreate, setPageCreate] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);
  const [userTeam, setUserTeam] = useState<
    { id: string | undefined; name: string; email: string; role: string }[]
  >([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

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

  useEffect(() => {
    const data = ressourceList;
    // setTimeout(() => {
    setRessourceList(data);
    // }, 100);
  }, [ressourceList]);

  // REMOVE A USER FROM TEAM LIST
  const handleRemoveTeamList = (id: string | undefined) => {
    let filteredList = userTeam.filter((team) => team.id !== id);
    setUserTeam(filteredList);
  };

  // create project
  const handleCreateProject = async () => {
    setIsCreateLoading(true);
    const projectid = uuid4();
    // trnasform the benefiary from an array to a string
    const beneficiary = directionOwner?.join(", ");
    // initilize budget data
    var budgetData: IBudget[] = [];
    // get the data of the user connected
    const userConnected = decodeToken("pr");

    // if there is budget add it in budgetData
    if (projectData?.budgetAmount !== 0 && projectData?.budgetAmount !== null) {
      budgetData = [
        {
          id: uuid4(),
          code: projectData?.codeBuget,
          direction: projectData?.directionSourceBudget,
          amount: projectData?.budgetAmount ?? 0,
          currency: projectData?.budgetCurrency,
        },
      ];
    } else {
      budgetData = [];
    }
    // if there is team members, map them and store in userProject
    const userProject = userTeam?.map((team) => ({
      userid: team.id,
      projectid: projectid,
      role: team.role,
    }));

    // trenasform all the data to a single object
    const data = {
      ...projectData,
      id: projectid,
      isEndDateImmuable: projectData?.isEndDateImmuable ? 1 : 0,
      initiator: userConnected?.name,
      beneficiary: beneficiary,
      listBudgets: budgetData,
      listRessources: ressourceList,
      listPhases: phaseAndLivrableList,
      listUsers: userProject,
    };

    console.log(data);
    try {
      // create project service
      await createProject(data);
      setIsAddProject(false);
    } catch (error) {
      console.log(`Error at create project: ${error}`);
    } finally {
      // stop loading
      setIsCreateLoading(false);
    }
  };

  return (
    <div className="text-sm">
      {/* ===== LINK RETURN START ===== */}
      <div className={`w-full mb-2 flex  items-center `}>
        <button
          onClick={() => {
            setIsAddProject(false);
          }}
          className={`md:w-fit gap-2  w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90 md:ease-out md:duration-300 md:transform   ${
            isLoaded ? "md:translate-x-0 " : "md:translate-x-[60vw]"
          }`}
        >
          Retour
        </button>
      </div>
      {/* ===== LINK RETURN END ===== */}
      {/* ===== BLOC ADD PROJECT START ===== */}
      <div className="flex flex-col items-center bg-white relative  overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-3  rounded-md dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
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
                projectData?.startDate === ""
                // ||
                // directionOwner?.length === 0
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
              projectData?.startDate === ""
                ? // ||
                  // directionOwner?.length === 0
                  "cursor-default opacity-70"
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
                projectData?.startDate === ""
                // ||
                // directionOwner?.length === 0
              ) {
                return;
              }
              setPageCreate(3);
            }}
            className={`border p-2 border-slate-200 tranform duration-500 ease-linear cursor-pointer ${
              pageCreate === 3 ? "bg-amber-200" : ""
            } 
            ${
              projectData?.title === "" ||
              projectData?.startDate === undefined ||
              projectData?.startDate === ""
                ? // ||
                  // directionOwner?.length === 0
                  "cursor-default opacity-70"
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
                projectData?.startDate === ""
                // ||
                // directionOwner?.length === 0
              ) {
                return;
              }
              setPageCreate(4);
            }}
            className={`border p-2 border-slate-200 tranform duration-500 ease-linear cursor-pointer ${
              pageCreate === 4 ? "bg-amber-200" : ""
            }
            ${
              projectData?.title === "" ||
              projectData?.startDate === undefined ||
              projectData?.startDate === ""
                ? // ||
                  // directionOwner?.length === 0
                  "cursor-default opacity-70"
                : "cursor-pointer"
            } `}
          >
            Equipe
          </div>
          <div>
            <span className="text-red-500 font-bold">*</span>
            <span> : Champ obligatoire</span>
          </div>
        </div>

        {/* ===== ADVANCEMENT STEP MENUE END ===== */}
        <span className="font-bold tracking-widest text-lg   ">
          Ajouter un nouveau projet
        </span>
        {/* ===== FORM CREATE START ===== */}
        <div className="pt-2 md:w-1/2  ">
          {/* ===== CREATE PROJECT LEVEL ONE START INFO GENERAL ===== */}

          <InfoGeneralAdd
            setPageCreate={setPageCreate}
            pageCreate={pageCreate}
            setProjectData={setProjectData}
            projectData={projectData}
            departments={departments}
            setDirectionOwner={setDirectionOwner}
          />

          {/* ===== CREATE PROJECT LEVEL ONE END INFO GENERAL ===== */}

          {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE START ===== */}

          <BudgetAndRessourceAdd
            setPageCreate={setPageCreate}
            pageCreate={pageCreate}
            setProjectData={setProjectData}
            projectData={projectData}
            departments={departments}
            setRessourceList={setRessourceList}
            ressourceList={ressourceList}
          />

          {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE END ===== */}
          {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE START ===== */}

          <PhasesAdd
            setPageCreate={setPageCreate}
            pageCreate={pageCreate}
            setPhaseAndLivrableList={setPhaseAndLivrableList}
            phaseAndLivrableList={phaseAndLivrableList}
            projectData={projectData}
          />

          {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE END ===== */}
          {/* ===== CREATE PROJECT LEVEL FOUR: TEAM START ===== */}
          <div
            className={`space-y-2  transition-all duration-1000 ease-in-out ${
              pageCreate === 4 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
          >
            <div className="space-y-4  ">
              <span className="font-semibold tracking-wide underline">
                EQUIPES
              </span>
              <div className="space-y-2 ">
                {/* ===== PROJECT DIRECTOR START ===== */}
                <div>
                  <div>Directeur de projet</div>
                  <div className="hide-scrollbar  ">
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
                          const initials = getInitials(team?.name);
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
                  <div className="hide-scrollbar ">
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
                          const initials = getInitials(team?.name);
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
                {/* ===== PROJECT TEAM START ===== */}
                <div>
                  <div>Observateur</div>
                  <div className="hide-scrollbar ">
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
                          const initials = getInitials(team?.name);
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
              </div>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setPageCreate(3)}
                  className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                >
                  Précédent
                </button>
                <button
                  onClick={handleCreateProject}
                  className="md:w-fit gap-2 w-full flex cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                >
                  {isCreateLoading && (
                    <span>
                      <PuffLoader size={20} className="mr-2" />
                    </span>
                  )}
                  Créer le projet
                </button>
              </div>
            </div>
          </div>
          {/* ===== CREATE PROJECT LEVEL FOUR: TEAM END ===== */}
        </div>
        {/* ===== FORM CREATE END ===== */}
      </div>
      {/* ===== BLOC ADD PROJECT END ===== */}
    </div>
  );
};

export default AddProject;
