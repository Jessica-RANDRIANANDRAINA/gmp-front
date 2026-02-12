import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
} from "../../../../types/Project";
import Breadcrumb from "../../../../components/BreadCrumbs/BreadCrumb";
import { getAllDepartments } from "../../../../services/User";
import { updateProject, getProjectById } from "../../../../services/Project";
import { decodeToken } from "../../../../services/Function/TokenService";
import {
  InfoGeneralUpdate,
  BudgetAndRessourcesUpdate,
  PhasesUpdate,
  TeamProjectUpdate,
} from "./subPages";
import ProjectLayout from "../../../../layout/ProjectLayout";
import { v4 as uuid4 } from "uuid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [updateProjectState, setUpdateProjectState] = useState(false);
  const [projectDataToModif, setProjectDataToModif] = useState<IProjectData>();
  const [allDataIsLoaded, setAllDataIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState<IProjectData>({
    id: "",
    codeProjet: "",
    title: "",
    description: "",
    priority: "Moyenne",
    criticality: "Moins urgente",
    beneficiary: "",
    initiator: "",
    startDate: undefined,
    endDate: undefined,
    isEndDateImmuable: false,
    endDateChangeReason: "",
    listBudgets: [],
    listRessources: [],
    listPhases: [],
    listUsers: [],
    idBudget: "",
    codeBuget: "",
    anneeBudget: "",
    directionSourceBudget: "",
    budgetAmount: null,
    budgetCurrency: "MGA",
  });
  const [ressourceList, setRessourceList] = useState<Array<IRessource>>([]);
  const [phaseAndLivrableList, setPhaseAndLivrableList] = useState<
    Array<IPhase>
  >([]);
  const [directionOwner, setDirectionOwner] = useState<string[]>([]);
  const [pageCreate, setPageCreate] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);
  const [userTeam, setUserTeam] = useState<
    { id: string | undefined; name: string; email: string; role: string }[]
  >([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [, setHaveBudget] = useState(false);
  const [isAllowedToUpdate, setIsAllowedToUpdate] = useState<boolean>(false);
  const [budgetList, setBudgetList] = useState<IBudget[]>([]);

  useEffect(() => {
    const allowedGeneral =
      projectData?.title?.trim() !== "" &&
      directionOwner?.join(", ") !== "" &&
      projectData?.startDate !== "";
    const allowedPhase = phaseAndLivrableList?.length > 0;
    const allowedTeam =
      userTeam?.length > 0 && userTeam.some((user) => user.role === "director");
    const allowedUpdate = allowedGeneral && allowedPhase && allowedTeam;
    setIsAllowedToUpdate(allowedUpdate);
  }, [projectData, directionOwner, phaseAndLivrableList, userTeam]);

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
        codeProjet: projectDataToModif?.codeProjet,
        title: projectDataToModif?.title,
        description: projectDataToModif?.description,
        priority: projectDataToModif?.priority,
        criticality: projectDataToModif?.criticality,
        state: projectDataToModif?.state,
        beneficiary: "",
        endDateChangeReason: projectDataToModif?.endDateChangeReason,
        initiator: projectDataToModif?.initiator,
        startDate: projectDataToModif?.startDate,
        endDate: projectDataToModif?.endDate,
        isEndDateImmuable: projectDataToModif?.isEndDateImmuable,
        listBudgets: [],
        listRessources: [],
        listPhases: [],
        listUsers: [],
        idBudget: projectDataToModif?.listBudgets?.[0]?.id,
        codeBuget: projectDataToModif?.listBudgets?.[0]?.code,
        anneeBudget: projectDataToModif?.listBudgets?.[0]?.anneebudget,
        directionSourceBudget: projectDataToModif?.listBudgets?.[0]?.direction,
        budgetAmount: projectDataToModif?.listBudgets?.[0]?.amount,
        budgetCurrency: projectDataToModif?.listBudgets?.[0]?.currency ?? "MGA",
      });

      const budgetData: IBudget[] = [];
      const ressourceData: IRessource[] = [];
      const phaseData: IPhase[] = [];
      const team = [];
      if (projectDataToModif?.listBudgets?.length > 0) {
        for (let i = 0; i< projectDataToModif.listBudgets.length; i++) {
          budgetData.push({
            id: projectDataToModif.listBudgets[i]?.id || uuid4(),
            code: projectDataToModif.listBudgets[i]?.code || "",
            anneebudget : projectDataToModif.listBudgets[i]?.anneebudget || "",
            direction: projectDataToModif.listBudgets[i]?.direction || "",
            amount: projectDataToModif.listBudgets[i]?.amount || 0,
            currency: projectDataToModif.listBudgets[i]?.currency || "MGA",
          });
        }
        setBudgetList(budgetData);
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
            weight:Number (projectDataToModif.listPhases[i]?.weight ?? 0),
            progress: projectDataToModif.listPhases[i]?.progress ?? 0,
            completionPercentage:
              projectDataToModif.listPhases[i]?.completionPercentage ?? 0,
            listDeliverables:
              projectDataToModif.listPhases[i]?.listDeliverables ?? [],
            startDate: projectDataToModif.listPhases[i]?.startDate,
            endDate: projectDataToModif.listPhases[i]?.endDate,
            dependantOf: projectDataToModif.listPhases[i]?.dependantOf,
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
            role: projectDataToModif.listUsers[i]?.role ?? "",
          });
        }
        setUserTeam(team);
      }
      setAllDataIsLoaded(true);
    }
  }, [projectDataToModif]);

  useEffect(() => {
    const fetchDepartment = async () => {
      const depart = await getAllDepartments();
      const allDepart = depart?.filter((d: string) => d !== "Vide");
      setDepartments(allDepart);
    };
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (updateProjectState) {
      handleUpdateProject();
    }
  }, [updateProjectState]);

  const handleUpdateProject = async () => {
    setIsCreateLoading(true);
    const projectid = uuid4();
    const beneficiary = directionOwner?.join(", ");
    const userConnected = decodeToken("pr");

    const userProject = userTeam?.map((team) => ({
      userid: team.id,
      projectid: projectid,
      role: team?.role,
      name: team?.name,
    }));

    const data = {
      ...projectData,
      codeProjet: projectData.codeProjet || "",
      isEndDateImmuable: projectData?.isEndDateImmuable ? 1 : 0,
      initiator: userConnected?.name,
      beneficiary: beneficiary,
      listBudgets: budgetList,
      listRessources: ressourceList,
      listPhases: phaseAndLivrableList,
      listUsers: userProject,
    };

    try {
      await updateProject(data?.id, data);
      notyf.success(`Projet modifié avec succès !`);
      navigate(`/gmp/project/details/${projectId}/details`);
    } catch (error) {
      notyf.error(
        `Veuillez remplir tous les champs correctement. Si l'erreur persiste, veuillez contacter l'administrateur.`
      );
      console.log(`Error at update project: ${error}`);
    } finally {
      setIsCreateLoading(false);
      setUpdateProjectState(false);
    }
  };

  return (
    <ProjectLayout>
      <div className="text-sm mx-2 p-4 md:mx-5">
        <div className={`w-full  text-base mb-2 flex  items-center `}>
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              {
                name: "Détails",
                to: `/gmp/project/details/${projectId}/details`,
              },
              { name: "Modification projet" },
            ]}
          />
        </div>
        <div className=" grid place-items-center bg-white relative  overflow-y-auto overflow-x-clip  p-4 shadow-3  rounded-md dark:border-strokedark dark:bg-boxdark  md:h-[72vh] lg:h-[75vh]">
          <div
            className={`justify-center items-center h-full ${
              allDataIsLoaded ? "hidden" : "flex"
            }`}
          >
            loading . . .
          </div>
          <div
            className={`w-full h-full flex-col items-center ${
              allDataIsLoaded ? "flex" : "hidden"
            }`}
          >
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
                <span className="mx-auto">Équipe </span>
              </div>
            </div>

            <div className="font-bold w-full text-center tracking-widest text-lg  ">
              Modifier le projet
            </div>
            <div className="pt-2  w-full px-2 md:px-20 lg:px-30 xl:px-50">
              <InfoGeneralUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                projectData={projectData}
                setProjectData={setProjectData}
                departments={departments}
                setDirectionOwner={setDirectionOwner}
                projectDataToModif={projectDataToModif}
              />

              <BudgetAndRessourcesUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                projectData={projectData}
                setProjectData={setProjectData}
                departments={departments}
                ressourceList={ressourceList}
                setRessourceList={setRessourceList}
                budgetList={budgetList}
                setBudgetList={setBudgetList}
              />

              <PhasesUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                phaseAndLivrableList={phaseAndLivrableList}
                setPhaseAndLivrableList={setPhaseAndLivrableList}
                projectData={projectData}
              />

              <TeamProjectUpdate
                pageCreate={pageCreate}
                setPageCreate={setPageCreate}
                userTeam={userTeam}
                setUserTeam={setUserTeam}
                isCreateLoading={isCreateLoading}
                setUpdateProjectState={setUpdateProjectState}
                isAllowedToUpdate={isAllowedToUpdate}
                phaseAndLivrableList={phaseAndLivrableList}
              />
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

export default UpdateProject;