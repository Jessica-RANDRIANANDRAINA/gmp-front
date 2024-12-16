import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
} from "../../../../types/Project";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { getAllDepartments } from "../../../../services/User";
import { createProject } from "../../../../services/Project";
import { decodeToken } from "../../../../services/Function/TokenService";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { v4 as uuid4 } from "uuid";
import {
  InfoGeneralAdd,
  BudgetAndRessourceAdd,
  PhasesAdd,
  TeamAdd,
} from "./subPages";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddProject = () => {
  const navigate = useNavigate();
  // const [isLoaded, setIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState<IProjectData>({
    id: "",
    title: "",
    description: "",
    priority: "Moyenne",
    criticality: "Normale",
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

  // useEffect(() => {
  //   setIsLoaded(true);
  // }, []);

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

    try {
      // create project service
      await createProject(data);

      notyf.success(`Projet Crée avec succès.`);
      navigate("/gmp/project/list");
    } catch (error) {
      notyf.error(`Une erreur s'est produite, veuillez réessayer plus tard`);
      console.log(`Error at create project: ${error}`);
    } finally {
      // stop loading
      setIsCreateLoading(false);
      setCreateProjectState(false);
    }
  };

  return (
    <ProjectLayout>
      <div className="text-sm mx-2 p-4 md:mx-5">
        {/* ===== LINK RETURN START ===== */}
        <div className={`w-full mb-2 flex text-base items-center `}>
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              { name: "Ajout Projet" },
            ]}
          />
        </div>
        {/* ===== LINK RETURN END ===== */}
        {/* ===== BLOC ADD PROJECT START ===== */}
        <div className=" relative bg-white  place-items-center  overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-1  rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
          {/* ===== ADVANCEMENT STEP MENUE START ===== */}
          <div className="absolute my-2 ml-2 text-xs top-0 left-0 space-y-3 md:block hidden">
            <div
              onClick={() => setPageCreate(1)}
              className={`relative space-x-1 border border-dotted  flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
               ${
                 pageCreate === 1
                   ? "bg-amber-200 dark:bg-orange2 dark:text-black-2"
                   : ""
               }
               
               `}
            >
              <span className="mx-auto">Information générale</span>
            </div>
            <div
              onClick={() => setPageCreate(2)}
              className={`relative border border-dotted  flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
                ${pageCreate < 2 ? "bg-transparent" : ""}
                ${
                  pageCreate === 2
                    ? "bg-amber-200 dark:bg-orange2 dark:text-black-2"
                    : ""
                }
               
               `}
            >
              <span className="mx-auto">Budget et ressources</span>
            </div>
            <div
              onClick={() => setPageCreate(3)}
              className={`relative border border-dotted  flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer
                ${pageCreate < 3 ? "bg-transparent" : ""}
                ${
                  pageCreate === 3
                    ? "bg-amber-200 dark:bg-orange2 dark:text-black-2"
                    : ""
                }
               
               `}
            >
              <span className="mx-auto">Phases et livrables</span>
            </div>
            <div
              onClick={() => setPageCreate(4)}
              className={`relative border border-dotted flex justify-between items-center rounded-full p-2 border-slate-500 transform duration-500 ease-linear cursor-pointer 
                ${
                  pageCreate === 4
                    ? "bg-amber-200 dark:bg-orange2 dark:text-black-2"
                    : ""
                }
                `}
            >
              <span className="mx-auto">Equipe</span>
            </div>
          </div>

          {/* ===== ADVANCEMENT STEP MENUE END ===== */}
          <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg   ">
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
