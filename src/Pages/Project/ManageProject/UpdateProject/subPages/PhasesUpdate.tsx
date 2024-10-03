import {
  CustomInput,
  CustomSelect,
} from "../../../../../components/UIElements";
import { IPhase, IProjectData } from "../../../../../types/Project";
import { v4 as uuid4 } from "uuid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const PhasesUpdate = ({
  pageCreate,
  setPageCreate,
  phaseAndLivrableList,
  setPhaseAndLivrableList,
  projectData,
}: {
  pageCreate: number;
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  phaseAndLivrableList: Array<IPhase>;
  setPhaseAndLivrableList: React.Dispatch<React.SetStateAction<Array<IPhase>>>;
  projectData: IProjectData;
}) => {
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

  const handlePhaseDataChange = (
    label: string,
    value: string,
    index: string
  ) => {
    setPhaseAndLivrableList((prevList) =>
      prevList.map((phase) =>
        phase?.id === index
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
  return (
    <form
      className={`space-y-2 transition-all duration-300 ease-in-out ${
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
          <div className="hide-scrollbar overflow-y-scroll xl:max-h-125 max-h-100">
            <button
              onClick={handleAddDefaultPhaseList}
              type="button"
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Utiliser les valeurs par défaut
            </button>
            {phaseAndLivrableList
              ?.filter((phase) => phase?.rank !== undefined)
              ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
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

                  <div className="grid md:grid-cols-2 gap-4 border-b-2 pb-2 mb-4">
                    <CustomInput
                      label="Phase"
                      type="text"
                      className="font-bold"
                      rounded="medium"
                      placeholder="Ex: conception"
                      value={phase?.phase1}
                      onChange={(e) => {
                        if (phase?.id)
                          handlePhaseDataChange(
                            "phase",
                            e.target.value,
                            phase?.id
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
                        if (phase?.id)
                          handlePhaseDataChange(
                            "livrable",
                            e.target.value,
                            phase?.id
                          );
                      }}
                      required
                    />
                    {/* <CustomSelect
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
                        console.log(phaseAssociated?.[0]);
                      }}
                    /> */}
                    <CustomInput
                      label="Date début"
                      type="date"
                      rounded="medium"
                      min={projectData?.startDate?.split("T")[0]}
                      value={
                        phase?.startDate ? phase?.startDate?.split("T")[0] : 0
                      }
                      onChange={(e) => {
                        if (phase?.id)
                          handlePhaseDataChange(
                            "startDate",
                            e.target.value,
                            phase?.id
                          );
                      }}
                    />
                    <CustomInput
                      label="Date fin"
                      type="date"
                      rounded="medium"
                      min={
                        phase?.startDate
                          ? phase?.startDate.split("T")[0]
                          : undefined
                      }
                      value={phase?.endDate ? phase?.endDate?.split("T")[0] : 0}
                      onChange={(e) => {
                        if (phase?.id)
                          handlePhaseDataChange(
                            "endDate",
                            e.target.value,
                            phase?.id
                          );
                      }}
                    />
                  </div>
                </div>
              ))}
            <button
              type="button"
              onClick={handleAddPhaseList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Ajouter une phase
            </button>
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
            // onClick={() => setPageCreate(4)}
            type="submit"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
    </form>
  );
};

export default PhasesUpdate;
