import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
} from "../../../../types/Project";
import { getAllDepartments } from "../../../../services/User";
import { createProject } from "../../../../services/Project/ProjectServices";
import { decodeToken } from "../../../../services/Function/TokenService";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { v4 as uuid4 } from "uuid";
import {
  InfoGeneralAdd,
  BudgetAndRessourceAdd,
  PhasesAdd,
  TeamAdd,
} from "./subPages";

const AddProject = () => {
  const navigate = useNavigate();
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
  const [createProjectState, setCreateProjectState] = useState(false);

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

  useEffect(() => {
    if (createProjectState) {
      handleCreateProject();
    }
  }, [createProjectState]);

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

    console.log("//////////////");
    console.log(data);
    console.log("//////////////");
    try {
      // create project service
      await createProject(data);
      navigate("/gmp/project/list");
    } catch (error) {
      console.log(`Error at create project: ${error}`);
    } finally {
      // stop loading
      setIsCreateLoading(false);
      setCreateProjectState(false);
    }
  };

  return (
    <ProjectLayout>
      <div className="text-sm mx-2 p-4 md:mx-10">
        {/* ===== LINK RETURN START ===== */}
        <div className={`w-full mb-2 flex  items-center `}>
          <button
            onClick={() => {
              navigate("/gmp/project/list");
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
        <div className=" relative bg-white grid place-items-center  overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-3  rounded-md dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
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
                ${pageCreate < 2 ? "bg-whiten" : ""}
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
              className={`relative border border-dotted w-10 h-10 flex justify-center items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
                ${pageCreate < 3 ? "bg-whiten" : ""}
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
          <div className="font-bold w-full text-center tracking-widest text-lg   ">
            Ajouter un nouveau projet
          </div>
          {/* ===== FORM CREATE START ===== */}
          <div className="pt-2  w-full px-2 md:px-20 lg:px-30 xl:px-50 ">
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
              setProjectData={setProjectData}
            />

            {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE END ===== */}
            {/* ===== CREATE PROJECT LEVEL FOUR: TEAM START ===== */}

            <TeamAdd
              setPageCreate={setPageCreate}
              pageCreate={pageCreate}
              userTeam={userTeam}
              setUserTeam={setUserTeam}
              setCreateProjectState={setCreateProjectState}
              isCreateLoading={isCreateLoading}
            />

            {/* ===== CREATE PROJECT LEVEL FOUR: TEAM END ===== */}
          </div>
          {/* ===== FORM CREATE END ===== */}
        </div>
        {/* ===== BLOC ADD PROJECT END ===== */}
      </div>
    </ProjectLayout>
  );
};

export default AddProject;
