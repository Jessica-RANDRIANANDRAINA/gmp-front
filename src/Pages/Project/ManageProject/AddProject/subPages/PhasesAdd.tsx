import {
  IPhase,
  IProjectData,
} from "../../../../../types/Project";
import {
  CustomInput,
} from "../../../../../components/UIElements";
import { v4 as uuid4 } from "uuid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

const PhasesAdd = ({
  pageCreate,
  setPageCreate,
  setPhaseAndLivrableList,
  phaseAndLivrableList,
  projectData
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  pageCreate: number;
  setPhaseAndLivrableList: React.Dispatch<React.SetStateAction<Array<IPhase>>>;
  phaseAndLivrableList: IPhase[];
  projectData: IProjectData;
}) => {

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
      },
      {
        id: uuid4(),
        rank: 1,
        phase1: "Réalisation",
        expectedDeliverable: "Signature de mise en production",
        startDate: undefined,
        endDate: undefined,
      },
      {
        id: uuid4(),
        rank: 2,
        phase1: "Mise en production",
        expectedDeliverable: "Plan de déploiement",
        startDate: undefined,
        endDate: undefined,
      },
      {
        id: uuid4(),
        rank: 3,
        phase1: "Clôture et maintenance",
        expectedDeliverable: "PV de recette",
        startDate: undefined,
        endDate: projectData?.endDate ?? undefined,
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

  // ADD PHASE IN THE LIST
  const handleAddPhaseList = () => {
    let phaseData: IPhase = {
      id: uuid4(),
      rank: 0,
      phase1: "",
      expectedDeliverable: "",
      startDate: undefined,
      endDate: undefined,
    };
    setPhaseAndLivrableList([...phaseAndLivrableList, phaseData]);
  };


  const handlePhaseDataChange = (
    label: string,
    value: string,
    index: number
  ) => {
    // let data = phaseAndLivrableList;
    // if (label === "phase") {
    //   data[index].phase1 = value;
    // } else if (label === "livrable") {
    //   data[index].expectedDeliverable = value;
    // }
    // setPhaseAndLivrableList(data);
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
                  : "endDate"]: value,
          }
          : phase
      )
    );
  };
  return (
    <form
      className={`space-y-2 transition-all duration-1000 ease-in-out ${pageCreate === 3 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
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
          <div className="hide-scrollbar overflow-y-auto md:max-h-125 md:min-h-125">
            <button
              type="button"
              onClick={handleAddDefaultPhaseList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke`}
            >
              Utiliser les valeurs par défaut
            </button>
            {phaseAndLivrableList?.map((phase, index) => (
              <div key={phase?.id}>
                <div className={"flex justify-between"}>
                  <div className={"underline"}>Phase {index + 1}</div>
                  <button
                    className={
                      "text-red-500 decoration-red-500 font-bold hover:font-black"
                    }
                    type="button"
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
                    value={phase?.startDate}
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
            type="submit"
            // onClick={() => setPageCreate(4)}
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
    </form>
  )
}

export default PhasesAdd