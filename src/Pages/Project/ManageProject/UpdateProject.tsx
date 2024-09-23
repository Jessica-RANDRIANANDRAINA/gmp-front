import { useEffect, useState } from "react";
import {
  CustomInput,
  CustomSelect,
  MultiSelect,
  CutomInputUserSearch,
} from "../../../components/UIElements";
import {
  IRessource,
  IPhase,
  IBudget,
  IProjectData,
  IHistoricProject,
} from "../../../types/Project";
import { getAllDepartments } from "../../../services/User";
import { updateProject } from "../../../services/Project/ProjectServices";
import { decodeToken } from "../../../services/Function/TokenService";
import { v4 as uuid4 } from "uuid";
import { PuffLoader } from "react-spinners";
import { getInitials } from "../../../services/Function/UserFunctionService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const UpdateProject = ({
  setIsModifProject,
  projectDataToModif,
  setProjectDataToModif,
}: {
  setIsModifProject: Function;
  setProjectDataToModif: Function;
  projectDataToModif: any;
}) => {
  useEffect(() => {
    console.log("**********************************");
    console.log(projectDataToModif);
    console.log("**********************************");
  }, [projectDataToModif]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectData, setProjectData] = useState<IProjectData>({
    id: projectDataToModif?.id,
    title: projectDataToModif?.title,
    completionPercentage: projectDataToModif?.completionPercentage,
    description: projectDataToModif?.description,
    priority: projectDataToModif?.priority,
    beneficiary: "",
    initiator: projectDataToModif?.initiator,
    startDate: projectDataToModif?.startDate,
    endDate: projectDataToModif?.endDate,
    isEndDateImmuable:
      projectDataToModif?.isEndDateImmuable === 0 ? false : true,
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

  // Initialize ressource, phase, get the ancient ressource, phase
  useEffect(() => {
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
  }, [projectDataToModif]);

  // ADD RESSOURCE LIST
  const handleAddRessourceToList = () => {
    let ressourceData: IRessource = {
      id: uuid4(),
      ressource: "",
      source: "",
      type: "",
    };
    setRessourceList([...ressourceList, ressourceData]);
  };

  // REMOVE A RESSOURCE TO THE LIST
  const handleRemoveRessourceToList = (id: string) => {
    let filteredList = ressourceList.filter((ressource) => ressource.id !== id);
    setRessourceList(filteredList);
  };

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

  const handleRessourceDataChange = (
    field: string,
    index: number,
    value: string
  ) => {
    setRessourceList((prevState) => {
      const newRessources = [...prevState];
      newRessources[index] = { ...newRessources[index], [field]: value };
      return newRessources;
    });
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
          from: projectDataToModif.endDate,
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
      setIsModifProject(false);
    }
  };

  // Function to compare if data is previous
  const isPreviousDate = (date: string | number | Date | undefined) => {
    if (!date) return false;
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
  };

  return (
    <div>
      {/* ===== LINK RETURN START ===== */}
      <div className={`w-full  mb-2 flex  items-center `}>
        <button
          onClick={() => {
            setIsModifProject(false);
            setProjectDataToModif();
          }}
          className={`md:w-fit gap-2  w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90 md:ease-out md:duration-300 md:transform   ${
            isLoaded ? "md:translate-x-0 " : "md:translate-x-[60vw]"
          }`}
        >
          retour
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
          <form
            className={`space-y-2 transition-all duration-1000 ease-in-out ${
              pageCreate === 1 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              if (form.reportValidity()) {
                setPageCreate(2);
              }
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Titre"
                type="text"
                rounded="medium"
                help="Le titre du projet est obligatoire"
                placeholder="Titre du projet (80 caractères max)"
                value={projectData?.title?.slice(0, 80)}
                maxLength={80}
                required={true}
                onChange={(e) => {
                  setProjectData({
                    ...projectData,
                    title: e.target.value.slice(0, 80),
                  });
                }}
              />
              <CustomSelect
                label="Avancement du projet"
                placeholder="0"
                data={["0%", "25%", "50%", "75%", "100%"]}
                value={`${projectData?.completionPercentage}%`}
                onValueChange={(e) => {
                  setProjectData({
                    ...projectData,
                    completionPercentage: parseInt(e.split("%")?.[0]),
                  });
                }}
              />
            </div>
            <CustomInput
              label="Description"
              type="textarea"
              rounded="medium"
              placeholder="Description du projet"
              rows={5}
              cols={5}
              value={projectData?.description?.slice(0, 1000)}
              onChange={(e) => {
                setProjectData({
                  ...projectData,
                  description: e.target.value?.slice(0, 1000),
                });
              }}
            />
            <div className="grid  md:grid-cols-2 gap-4">
              <CustomSelect
                label="Priorité"
                placeholder="Priorité"
                data={["Faible", "Moyenne", "Elevée"]}
                value={projectData.priority}
                onValueChange={(e) => {
                  setProjectData({
                    ...projectData,
                    priority: e,
                  });
                }}
              />
              <MultiSelect
                id="001"
                label={"Direction propriétaire"}
                placeholder="Choisir une direction"
                value={departments}
                initialValue={projectDataToModif?.beneficiary}
                setValueMulti={setDirectionOwner}
                rounded="large"
                required={true}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <CustomInput
                label="Date début prévisionnelle"
                type="date"
                rounded="medium"
                value={
                  projectData?.startDate
                    ? projectData.startDate?.split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  setProjectData({
                    ...projectData,
                    startDate: e.target.value,
                  });
                }}
                required
                disabled={isPreviousDate(projectData?.startDate)}
              />
              <div className="grid  gap-2">
                <CustomInput
                  label="Date fin prévisionnelle"
                  type="date"
                  rounded="medium"
                  value={
                    projectData?.endDate
                      ? projectData.endDate?.split("T")[0]
                      : ""
                  }
                  help={
                    projectData.isEndDateImmuable
                      ? "Cette date est fixe"
                      : projectData?.endDate
                      ? "Tout changement de cette date devra être suivi de la raison"
                      : undefined
                  }
                  onChange={(e) => {
                    setProjectData({
                      ...projectData,
                      endDate: e.target.value,
                    });
                  }}
                  min={
                    projectData?.startDate
                      ? projectData.startDate?.split("T")[0]
                      : ""
                  }
                  disabled={
                    (projectData.startDate ? false : true) ||
                    projectData.isEndDateImmuable
                  }
                />
                <div className="">
                  <div
                    className={`${
                      projectData?.endDate?.split("T")[0] ===
                        projectDataToModif?.endDate?.split("T")[0] ||
                      projectDataToModif?.endDate === null
                        ? "hidden"
                        : ""
                    }
                  
                    `}
                  >
                    <CustomInput
                      label="raison de changement"
                      type="textarea"
                      rounded="medium"
                      value={hitoricProjectDate?.reason?.slice(0, 1000)}
                      maxLength={1000}
                      required={
                        !(
                          projectData?.endDate?.split("T")[0] ===
                            projectDataToModif?.endDate?.split("T")[0] ||
                          projectDataToModif?.endDate === null
                        )
                      }
                      onChange={(e) => {
                        setHistoricProjectDate({
                          ...hitoricProjectDate,
                          reason: e.target.value.slice(0, 1000),
                        });
                      }}
                    />
                  </div>
                  <div
                    className={`${
                      projectData?.endDate ? "opacity-100" : "opacity-50 hidden"
                    } transform duration-300
                  ${projectDataToModif?.isEndDateImmuable ? "hidden" : ""}
                  `}
                  >
                    <span className={`cursor-help relative  group`}>
                      Cette date est-elle imuable ?
                      <span className="absolute text-xs  font-thin hidden group-hover:flex max-w-59 min-w-59 bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999999 top-[-35px] left-1/2 transform -translate-x-1/2">
                        Si oui, Cette date sera impossible a modifier même en
                        cas de retard
                      </span>
                    </span>
                    <span className="flex flex-row flex-wrap gap-2">
                      <span className="space-x-2">
                        <input
                          value={"Oui"}
                          type="radio"
                          className="cursor-pointer"
                          name={"immuableEndDate"}
                          checked={projectData?.isEndDateImmuable}
                          onChange={() => {
                            setProjectData({
                              ...projectData,
                              isEndDateImmuable: true,
                            });
                          }}
                        />
                        <label>Oui</label>
                      </span>
                      <span className="space-x-2">
                        <input
                          value={"Non"}
                          className="cursor-pointer"
                          type="radio"
                          name={"immuableEndDate"}
                          onChange={() => {
                            setProjectData({
                              ...projectData,
                              isEndDateImmuable: false,
                            });
                          }}
                          checked={!projectData?.isEndDateImmuable}
                        />
                        <label>Non</label>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                // onClick={() => setPageCreate(2)}
                type="submit"
                className={`md:w-fit gap-2 w-full  mt-2 py-2 px-5  text-center font-medium text-white  lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen `}
              >
                Suivant
              </button>
            </div>
          </form>
          {/* ===== CREATE PROJECT LEVEL ONE END INFO GENERAL ===== */}

          {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE START ===== */}
          <form
            className={`space-y-2 transition-all duration-1000 ease-in-out ${
              pageCreate === 2 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              if (form.reportValidity()) {
                setPageCreate(3);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <span className="font-semibold tracking-wide underline">
                  BUDGET
                </span>
                <button
                  onClick={() => {
                    setHaveBudget(true);
                  }}
                  type="button"
                  className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke ${
                    haveBudget ? "hidden" : ""
                  }`}
                >
                  Est-ce que ce projet a un budget ?
                </button>
                {haveBudget && (
                  <>
                    <div className="flex justify-between">
                      <div></div>
                      <button
                        type="button"
                        className={`
                      text-red-500 decoration-red-500 font-bold hover:font-black
                      `}
                        onClick={() => {
                          setHaveBudget(false);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <CustomInput
                        label="Code"
                        type="text"
                        rounded="medium"
                        placeholder="Code budget"
                        // disabled={true}
                        value={projectData?.codeBuget}
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            codeBuget: e.target.value,
                          });
                        }}
                      />
                      <CustomSelect
                        label="Direction sponsor"
                        placeholder="Choisir une direction"
                        data={departments}
                        value={projectData.directionSourceBudget}
                        onValueChange={(e) => {
                          setProjectData({
                            ...projectData,
                            directionSourceBudget: e,
                          });
                        }}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <CustomInput
                        label="Montant du budget"
                        type="number"
                        step={0.01}
                        min={0}
                        rounded="medium"
                        placeholder="0"
                        value={projectData?.budgetAmount ?? ""}
                        required
                        onChange={(e) => {
                          setProjectData({
                            ...projectData,
                            budgetAmount: parseFloat(
                              parseFloat(e.target.value).toFixed(2)
                            ),
                          });
                        }}
                      />
                      <CustomSelect
                        label="Devise"
                        placeholder=" "
                        data={["MGA", "EUR"]}
                        value={projectData.budgetCurrency}
                        onValueChange={(e) => {
                          setProjectData({
                            ...projectData,
                            budgetCurrency: e,
                          });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                {/* ===== RESSOURCES START ===== */}
                <span className="font-semibold tracking-wide underline">
                  RESSOURCES
                </span>
                <div className=" max-h-80 min-h-80 overflow-y-scroll">
                  {ressourceList?.map((ressource, index) => {
                    return (
                      <div key={ressource.id}>
                        <div className={"flex justify-between"}>
                          <div className={"underline"}>
                            Ressource {index + 1}
                          </div>
                          <button
                            className={
                              "text-red-500 decoration-red-500 font-bold hover:font-black"
                            }
                            onClick={() => {
                              handleRemoveRessourceToList(ressource.id);
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                          <CustomInput
                            label="Source"
                            type="text"
                            rounded="medium"
                            placeholder="Ex: Massin"
                            value={ressource?.source}
                            onChange={(e) => {
                              handleRessourceDataChange(
                                "source",
                                index,
                                e.target.value
                              );
                            }}
                          />
                          <CustomSelect
                            label="Etat"
                            placeholder="Disponible"
                            data={["A acquérir", "Disponible"]}
                            value={ressource.type}
                            onValueChange={(e) => {
                              handleRessourceDataChange("type", index, e);
                            }}
                            required
                          />
                        </div>
                        <CustomInput
                          label="Resssource"
                          type="textarea"
                          rounded="medium"
                          placeholder="La ressource ex: un serveur"
                          value={ressource.ressource}
                          onChange={(e) => {
                            handleRessourceDataChange(
                              "ressource",
                              index,
                              e.target.value
                            );
                          }}
                          required
                        />
                      </div>
                    );
                  })}
                  <button
                    onClick={handleAddRessourceToList}
                    className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke`}
                  >
                    Ajouter une ressource
                  </button>
                </div>
                {/* ===== RESSOURCES END ===== */}
              </div>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setPageCreate(1)}
                  type="button"
                  className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                >
                  Précédent
                </button>
                <button
                  type="submit"
                  className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
                >
                  Suivant
                </button>
              </div>
            </div>
          </form>
          {/* ===== CREATE PROJECT LEVEL TWO: BUDGET AND RESSOURCE END ===== */}
          {/* ===== CREATE PROJECT LEVEL THREE: PHASES AND LIVRABLE START ===== */}
          <form
            className={`space-y-2 transition-all duration-1000 ease-in-out ${
              pageCreate === 3 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
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
                    ?.sort((a, b) => a.rank - b.rank)
                    ?.map((phase, index) => (
                      <div key={phase?.id}>
                        <div className={"flex justify-between"}>
                          <div className={"underline"}>Phase {index + 1}</div>
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
                              phase?.endDate ? phase?.endDate?.split("T")[0] : 0
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
              pageCreate === 4 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
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
      {/* ===== BLOC ADD PROJECT END ===== */}
    </div>
  );
};

export default UpdateProject;
