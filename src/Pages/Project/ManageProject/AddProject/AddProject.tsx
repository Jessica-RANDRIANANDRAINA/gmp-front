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
import { getAllMyHabilitation } from "../../../../services/Function/UserFunctionService";
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
  const [projectData, setProjectData] = useState<IProjectData>({
    id: "",
    codeProjet: "",
    title: "",
    description: "",
    priority: "Moyenne",
    criticality: "Normale",
    state: "Pas commencé",
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
    anneeBudget: "",
    directionSourceBudget: "",
    budgetAmount: null,
    budgetCurrency: "MGA",
  });
  const [ressourceList, setRessourceList] = useState<Array<IRessource>>([]);
  const [budgetList, setBudgetList] = useState<Array<IBudget>>([]);
  const [phaseAndLivrableList, setPhaseAndLivrableList] = useState<Array<IPhase>>([]);
  const [directionOwner, setDirectionOwner] = useState<any>();
  const [pageCreate, setPageCreate] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);
  const [userTeam, setUserTeam] = useState<
    { id: string | undefined; name: string; email: string; role: string }[]
  >([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createProjectState, setCreateProjectState] = useState(false);
  const [isAllowedToCreate, setIsAllowedToCreate] = useState<boolean>(false);

  const getMyHabilitation = async () => {
    const hab = await getAllMyHabilitation();
    if (!hab?.project.create) {
      navigate("/gmp/project/list");
    }
  };

  useEffect(() => {
    getMyHabilitation();
  }, []);

  useEffect(() => {
    const allowdGeneral =
      projectData?.title?.trim() !== "" &&
      // projectData?.codeProjet?.trim() !== "" &&
      // projectData?.codeProjet?.length >= 5 &&
      directionOwner?.join(", ") !== "" &&
      projectData?.startDate !== "";
    const allowedPhase = phaseAndLivrableList?.length > 0;
    const allowedTeam =
      userTeam?.length > 0 && userTeam.some((user) => user.role === "director");

    const allowedCreate = allowdGeneral && allowedPhase && allowedTeam;
    setIsAllowedToCreate(allowedCreate);
  }, [projectData, directionOwner, phaseAndLivrableList, userTeam]);

  useEffect(() => {
    const fetchDepartment = async () => {
      const depart = await getAllDepartments();
      const allDepart = depart?.filter((d: string) => d !== "Vide");
      setDepartments(allDepart);
    };
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (createProjectState) {
      handleCreateProject();
    }
  }, [createProjectState]);

  const handleCreateProject = async () => {
  setIsCreateLoading(true);
  const projectid = uuid4();
  const beneficiary = directionOwner?.join(", ");
  const userConnected = decodeToken("pr");

  // Vérifiez d'abord si codeProjet existe et respecte les règles
  if (projectData.codeProjet && !/^[A-Z0-9]{5,10}$/.test(projectData.codeProjet)) {
    notyf.error("Le code projet doit contenir entre 5 et 10 caractères alphanumériques");
    setIsCreateLoading(false);
    setCreateProjectState(false);
    return;
  }

  // Si codeProjet est null ou undefined, attribuez une valeur par défaut
  const finalCodeProjet = projectData.codeProjet || "DEFAULT_" + uuid4().substring(0, 5).toUpperCase();

  // Transform budgetList for submission
  const budgetData = budgetList.map(budget => ({
    ...budget,
    id: uuid4()
  }));

  const userProject = userTeam?.map((team) => ({
    userid: team.id,
    projectid: projectid,
    role: team.role,
  }));

  const data = {
    ...projectData,
    id: projectid,
    codeProjet: finalCodeProjet, // Utilisez la valeur finale
    isEndDateImmuable: projectData?.isEndDateImmuable ? 1 : 0,
    initiator: userConnected?.name,
    beneficiary: beneficiary,
    listBudgets: budgetData,
    listRessources: ressourceList,
    listPhases: phaseAndLivrableList,
    listUsers: userProject,
  };

  try {
    await createProject(data);
    notyf.success(`Projet Créé avec succès.`);
    navigate(`/gmp/project/details/${projectid}/details`);
  } catch (error) {
    notyf.error(`Une erreur s'est produite, veuillez réessayer plus tard`);
    console.error(`Error at create project: ${error}`);
  } finally {
    setIsCreateLoading(false);
    setCreateProjectState(false);
  }
};
  return (
    <ProjectLayout>
      <div className="text-sm mx-2 p-4 md:mx-5">
        <div className={`w-full mb-2 flex text-base items-center`}>
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              { name: "Ajout Projet" },
            ]}
          />
        </div>

        <div className="relative bg-white place-items-center overflow-y-scroll overflow-x-clip hide-scrollbar p-4 shadow-1 rounded-md border border-zinc-200 dark:border-strokedark dark:bg-boxdark min-h-fit md:min-h-fit md:h-[72vh] lg:h-[75vh]">
          <div className="absolute my-2 ml-2 text-xs top-0 left-0 space-y-3 md:block hidden">
            <div
              onClick={() => setPageCreate(1)}
              className={`relative space-x-1 border border-dotted flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer ${
                pageCreate === 1 ? "bg-amber-200 dark:bg-orange2 dark:text-black-2" : ""
              }`}
            >
              <span className="mx-auto">Information générale</span>
            </div>
            <div
              onClick={() => setPageCreate(2)}
              className={`relative border border-dotted flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer ${
                pageCreate === 2 ? "bg-amber-200 dark:bg-orange2 dark:text-black-2" : ""
              }`}
            >
              <span className="mx-auto">Budget et ressources</span>
            </div>
            <div
              onClick={() => setPageCreate(3)}
              className={`relative border border-dotted flex justify-between items-center rounded-full p-2 border-slate-500 tranform duration-500 ease-linear cursor-pointer ${
                pageCreate === 3 ? "bg-amber-200 dark:bg-orange2 dark:text-black-2" : ""
              }`}
            >
              <span className="mx-auto">Phases et livrables</span>
            </div>
            <div
              onClick={() => setPageCreate(4)}
              className={`relative border border-dotted flex justify-between items-center rounded-full p-2 border-slate-500 transform duration-500 ease-linear cursor-pointer ${
                pageCreate === 4 ? "bg-amber-200 dark:bg-orange2 dark:text-black-2" : ""
              }`}
            >
              <span className="mx-auto">Équipe</span>
            </div>
          </div>

          <div className="font-bold w-full text-black-2 dark:text-whiten text-center tracking-widest text-lg">
            Ajouter un nouveau projet
          </div>

          <div className="pt-2 w-full px-2 md:px-20 lg:px-30 xl:px-50">
            <InfoGeneralAdd
              setPageCreate={setPageCreate}
              pageCreate={pageCreate}
              setProjectData={setProjectData}
              projectData={projectData}
              departments={departments}
              setDirectionOwner={setDirectionOwner}
            />

            <BudgetAndRessourceAdd
              setPageCreate={setPageCreate}
              pageCreate={pageCreate}
              setProjectData={setProjectData}
              projectData={projectData}
              departments={departments}
              setRessourceList={setRessourceList}
              ressourceList={ressourceList}
              budgetList={budgetList}
              setBudgetList={setBudgetList}
            />

            <PhasesAdd
              setPageCreate={setPageCreate}
              pageCreate={pageCreate}
              setPhaseAndLivrableList={setPhaseAndLivrableList}
              phaseAndLivrableList={phaseAndLivrableList}
              projectData={projectData}
              setProjectData={setProjectData}
            />

            <TeamAdd
              setPageCreate={setPageCreate}
              pageCreate={pageCreate}
              userTeam={userTeam}
              setUserTeam={setUserTeam}
              setCreateProjectState={setCreateProjectState}
              isCreateLoading={isCreateLoading}
              isAllowedToCreate={isAllowedToCreate}
              phaseAndLivrableList={phaseAndLivrableList}
            />
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default AddProject;