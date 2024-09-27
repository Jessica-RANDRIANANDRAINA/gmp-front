import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  InfoGeneralUpdate,
  BudgetAndRessourcesUpdate,
  PhasesUpdate,
  TeamProjectUpdate,
} from "./subPages";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { v4 as uuid4 } from "uuid";

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [updateProjectState, setUpdateProjectState] = useState(false);
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

  useEffect(() => {
    if (updateProjectState) {
      handleUpdateProject();
    }
  }, [updateProjectState]);

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
      navigate("/gmp/project/list");
    } catch (error) {
      console.log(`Error at create project: ${error}`);
    } finally {
      // stop loading
      setIsCreateLoading(false);
      setUpdateProjectState(false);
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
        <div className=" grid place-items-center bg-white relative  overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-3  rounded-md dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
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
            className={`w-full h-full flex-col items-center ${
              allDataIsLoaded ? "flex" : "hidden"
            }`}
          >
            {/* ===== ADVANCEMENT STEP MENUE START ===== */}
            <div className="absolute my-2 ml-2 top-0 left-0 space-y-3 md:block hidden">
              <div
                // onClick={() => setPageCreate(1)}
                className={`relative border border-dotted w-10 h-10 flex justify-center items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
               ${pageCreate === 1 ? "bg-amber-200" : "bg-emerald-600"}
               
               `}
              >
                <span
                  className={`absolute transition-transform duration-500 ease-in-out transform ${
                    pageCreate !== 1 ? "scale-0" : "scale-100"
                  }`}
                >
                  1
                </span>
                <svg
                  className={`transition-transform duration-500 ease-in-out transform stroke-current ${
                    pageCreate !== 1 ? "scale-100" : "scale-0"
                  }`}
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#fff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              <div
                // onClick={() => setPageCreate(2)}
                className={`relative border border-dotted w-10 h-10 flex justify-center items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
                  ${pageCreate < 2 ? "bg-whiten":""}
                  ${pageCreate === 2 ? "bg-amber-200" : "bg-emerald-600"}
               
               `}
              >
                <span
                  className={`absolute transition-transform duration-500 ease-in-out transform ${
                    pageCreate > 2 ? "scale-0" : "scale-100"
                  }`}
                >
                  2
                </span>
                <svg
                  className={`transition-transform duration-500 ease-in-out transform stroke-current ${
                    pageCreate > 2 ? "scale-100" : "scale-0"
                  }`}
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#317f15"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              <div
                // onClick={() => setPageCreate(2)}
                className={`relative  border border-dotted w-10 h-10 flex justify-center items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
                  ${pageCreate < 3 ? "bg-whiten":""}
                  ${pageCreate === 3 ? "bg-amber-200" : "bg-emerald-600"}
               
               `}
              >
                <span
                  className={`absolute transition-transform duration-500 ease-in-out transform ${
                    pageCreate > 3 ? "scale-0" : "scale-100"
                  }`}
                >
                  3
                </span>
                <svg
                  className={`transition-transform duration-500 ease-in-out transform stroke-current ${
                    pageCreate > 3 ? "scale-100" : "scale-0"
                  }`}
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#317f15"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              <div
                // onClick={() => setPageCreate(2)}
                className={`relative border border-dotted w-10 h-10 flex justify-center items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
               ${pageCreate === 4 ? "bg-amber-200" : ""}
               
               `}
              >
                <span
                  className={`absolute transition-transform duration-500 ease-in-out transform ${
                    userTeam.length > 0 ? "scale-0" : "scale-100"
                  }`}
                >
                  4
                </span>
                <svg
                  className={`transition-transform duration-500 ease-in-out transform stroke-current ${
                    userTeam.length > 0 ? "scale-100" : "scale-0"
                  }`}
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#317f15"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#317f15"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
              {/* <div className="text-sm font-semibold text-zinc-700">
            <span className="text-red-500 font-bold">*</span>
            <span> : Champ obligatoire</span>
          </div> */}
            </div>

            {/* ===== ADVANCEMENT STEP MENUE END ===== */}
            <div className="font-bold w-full text-center tracking-widest text-lg  ">
              Modifier le projet
            </div>
            {/* ===== FORM CREATE START ===== */}
            <div className="pt-2  w-full px-2 md:px-20 lg:px-30 xl:px-50">
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

              <PhasesUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                phaseAndLivrableList={phaseAndLivrableList}
                setPhaseAndLivrableList={setPhaseAndLivrableList}
                projectData={projectData}
              />

              {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE END ===== */}
              {/* ===== CREATE PROJECT LEVEL FOUR: TEAM START ===== */}
              <TeamProjectUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                userTeam={userTeam}
                setUserTeam={setUserTeam}
                isCreateLoading={isCreateLoading}
                setUpdateProjectState={setUpdateProjectState}
              />
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
