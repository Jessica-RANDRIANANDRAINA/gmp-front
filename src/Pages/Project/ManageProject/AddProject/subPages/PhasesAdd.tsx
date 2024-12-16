import { useState } from "react";
import { IPhase, IProjectData } from "../../../../../types/Project";
import {
  CustomInput,
  CustomSelect,
} from "../../../../../components/UIElements";
import { v4 as uuid4 } from "uuid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const PhasesAdd = ({
  pageCreate,
  setPageCreate,
  setPhaseAndLivrableList,
  phaseAndLivrableList,
  projectData,
  setProjectData,
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  pageCreate: number;
  setPhaseAndLivrableList: React.Dispatch<React.SetStateAction<Array<IPhase>>>;
  phaseAndLivrableList: IPhase[];
  projectData: IProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
}) => {
  const [inputErrors, setInputErrors] = useState<{
    [key: number]: { phase1?: string; expectedDeliverable?: string };
  }>({});
  const [phasesNames, setPhasesNames] = useState<Array<string | undefined>>([]);
  const [activePhaseId, setActivePhaseId] = useState<string | undefined>(
    undefined
  );

  // ADD DEFAULT VALUE IN PHASE LIST
  const handleAddDefaultPhaseList = () => {
    let phaseData: IPhase[] = [
      {
        id: uuid4(),
        rank: 0,
        phase1: "Conception",
        expectedDeliverable: "Document de cadrage",
        startDate: projectData?.startDate,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 1,
        phase1: "Réalisation",
        expectedDeliverable: "Signature de mise en production",
        startDate: undefined,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 2,
        phase1: "Mise en production",
        expectedDeliverable: "Plan de déploiement",
        startDate: undefined,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 3,
        phase1: "Clôture et maintenance",
        expectedDeliverable: "PV de recette",
        startDate: undefined,
        endDate: projectData?.endDate ?? undefined,
        dependantOf: undefined,
      },
    ];
    const initialId = phaseData?.[0]?.id;
    setActivePhaseId(initialId);

    setPhaseAndLivrableList(phaseData);
    const phasesNamesData = phaseData.map((phase) => phase.phase1);
    setPhasesNames(phasesNamesData);
  };

  // REMOVE A PHASE TO THE LIST
  const handleRemovePhaseList = (phaseId: string, index: number) => {
    let filteredList = phaseAndLivrableList.filter(
      (phase) => phase.id !== phaseId
    );
    setPhaseAndLivrableList(filteredList);
    if (activePhaseId === phaseId) {
      const id = filteredList?.[index - 1]?.id;
      setActivePhaseId(id);
    }
  };

  // VERIFY IF THE PREVIOUS PHASE IS VALID
  const isPreviousPhaseValid = () => {
    if (phaseAndLivrableList.length === 0) {
      return true;
    }

    const previousPhase = phaseAndLivrableList[phaseAndLivrableList.length - 1];
    let errors: { phase1?: string; expectedDeliverable?: string } = {};

    if (!previousPhase.phase1) {
      errors.phase1 = "Veuillez rempir ce champ";
    }
    if (!previousPhase.expectedDeliverable) {
      errors.expectedDeliverable = "Veuillez rempir ce champ";
    }
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [phaseAndLivrableList.length - 1]: errors,
    }));

    // Return true if no errors
    return !errors.phase1 && !errors.expectedDeliverable;
  };

  // ADD PHASE IN THE LIST
  const handleAddPhaseList = () => {
    if (!isPreviousPhaseValid()) {
      return;
    }

    let previousPhaseEndDate =
      phaseAndLivrableList.length > 0
        ? phaseAndLivrableList[phaseAndLivrableList.length - 1].endDate
        : projectData?.startDate;

    const id = uuid4();
    let phaseData: IPhase = {
      id: id,
      rank: phaseAndLivrableList.length,
      phase1: "",
      expectedDeliverable: "",
      startDate: previousPhaseEndDate,
      endDate: projectData?.endDate ? projectData?.endDate : undefined,
    };
    setActivePhaseId(id);
    setPhaseAndLivrableList([...phaseAndLivrableList, phaseData]);
  };

  const handlePhaseDataChange = (
    label: string,
    value: string | undefined,
    index: number
  ) => {
    setPhaseAndLivrableList((prevList) =>
      prevList.map((phase, idx) =>
        idx === index
          ? {
              ...phase,
              rank: index,
              [label === "phase"
                ? "phase1"
                : label === "livrable"
                ? "expectedDeliverable"
                : label === "startDate"
                ? "startDate"
                : label === "depandantOf"
                ? "dependantOf"
                : "endDate"]: value,
            }
          : phase
      )
    );
  };
  return (
    <form
      className={`space-y-2 transition-all duration-1000 ease-in-out ${
        pageCreate === 3 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (form.reportValidity()) {
          if (phaseAndLivrableList.length > 0) {
            let latestEndDate = phaseAndLivrableList.reduce((latest, phase) => {
              if (phase.endDate && latest) {
                const phaseEndDate = new Date(phase.endDate);
                const latestDate = new Date(latest);
                return phaseEndDate > latestDate ? phase.endDate : latest;
              }
              return latest;
            }, projectData.endDate ?? "");

            if (new Date(latestEndDate) > new Date(projectData.endDate ?? "")) {
              setProjectData((prevData) => ({
                ...prevData,
                endDate: latestEndDate,
              }));
            }

            setPageCreate(4);
          } else {
            notyf.error("Un projet doit contenir au moins une phase");
          }
        }
      }}
    >
      <div className="space-y-4 ">
        <div>
          <span className="font-semibold tracking-wide underline">
            PHASES ET LIVRABLES
          </span>
          <div className="overflow-y-auto xl:max-h-125 max-h-100 ">
            <button
              type="button"
              onClick={handleAddDefaultPhaseList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Utiliser les valeurs par défaut
            </button>
            <button
              type="button"
              onClick={handleAddPhaseList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Ajouter une phase
            </button>
            <div className="mt-2 space-y-4">
              <div className="flex flex-wrap gap-1">
                {phaseAndLivrableList?.map((phase, index) => (
                  <div key={phase?.id}>
                    <div className="flex">
                      <div
                        className={`flex text base border rounded-md cursor-pointer hover:bg-green-50 dark:hover:bg-green-200 border-green-200 dark:border-green-300 dark:hover:text-green-700 ${
                          activePhaseId === phase?.id
                            ? "dark:bg-green-200 bg-green-100 text-green-500 dark:text-green-600 dark:border-2 font-semibold"
                            : ""
                        }`}
                      >
                        <span
                          className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium"
                          onClick={() => {
                            setActivePhaseId(phase?.id);
                          }}
                        >
                          Phase {index + 1}
                        </span>
                        <button
                          className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={() =>
                            handleRemovePhaseList(phase.id ?? "", index)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {phaseAndLivrableList?.map((phase, index) => (
                <div
                  key={phase?.id}
                  className={`${activePhaseId === phase?.id ? "" : "hidden"}`}
                >
                  <div className="grid md:grid-cols-2 gap-4  pb-2 mb-4">
                    <CustomInput
                      label="Phase"
                      className="font-bold *:text-emerald-500 dark:*:text-emerald-500"
                      type="text"
                      rounded="medium"
                      placeholder="Ex: conception"
                      value={phase?.phase1}
                      help="Le nom de la phase"
                      onChange={(e) => {
                        handlePhaseDataChange("phase", e.target.value, index);
                        setInputErrors((prev) => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            phase1: "",
                          },
                        }));
                      }}
                      required
                      error={inputErrors[index]?.phase1}
                    />
                    <CustomInput
                      label="Livrable(s)"
                      type="text"
                      rounded="medium"
                      placeholder="Ex: dossier de conception"
                      help="Document attendu pour valider la finalité de cette phase"
                      value={phase?.expectedDeliverable}
                      onChange={(e) => {
                        handlePhaseDataChange(
                          "livrable",
                          e.target.value,
                          index
                        );
                        setInputErrors((prev) => ({
                          ...prev,
                          [index]: {
                            ...prev[index],
                            expectedDeliverable: "",
                          },
                        }));
                      }}
                      required
                      error={inputErrors[index]?.expectedDeliverable}
                    />
                    <CustomSelect
                      className={`md:col-span-2 ${index === 0 ? "hidden" : ""}`}
                      label="Dépendante de"
                      placeholder="Une phase obligatoire avant celle-ci"
                      data={phasesNames?.filter((p) => p != phase?.phase1)}
                      value={phaseAndLivrableList[index].dependantOf}
                      onValueChange={(e) => {
                        const phaseAssociated = phaseAndLivrableList.filter(
                          (phase) => {
                            return phase.phase1 === e;
                          }
                        );
                        handlePhaseDataChange(
                          "depandantOf",
                          phaseAssociated?.[0]?.id,
                          index
                        );
                      }}
                    />
                    <CustomInput
                      label="Date début"
                      type="date"
                      rounded="medium"
                      value={phase?.startDate}
                      min={
                        phase.dependantOf
                          ? phaseAndLivrableList.find(
                              (p) => p.id === phase.dependantOf
                            )?.endDate
                          : projectData?.startDate
                      }
                      // max={projectData?.endDate ? projectData?.endDate : ""}
                      max={""}
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
                      value={phase?.endDate}
                      // min={phaseAndLivrableList?.[index]?.startDate }
                      min={
                        phase?.startDate
                          ? phase.startDate
                          : phaseAndLivrableList?.[index]?.startDate
                      }
                      onChange={(e) => {
                        handlePhaseDataChange("endDate", e.target.value, index);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPageCreate(2)}
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg  dark:bg-transparent dark:hover:bg-boxdark2"
          >
            Précédent
          </button>
          <button
            type="submit"
            // onClick={() => setPageCreate(4)}
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
    </form>
  );
};

export default PhasesAdd;
