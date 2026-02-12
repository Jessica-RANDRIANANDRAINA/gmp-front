import { useState } from "react";
import { IPhase, IProjectData } from "../../../../../types/Project";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { CustomInput } from "../../../../../components/UIElements";
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
  const [activePhaseId, setActivePhaseId] = useState<string | undefined>(undefined);
  // Modal confirmation de suppression de phase
  const [isConfirmDeletePhaseOpen, setIsConfirmDeletePhaseOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pendingDeletePhase, setPendingDeletePhase] = useState<IPhase | null>(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [deleteTimeoutId, setDeleteTimeoutId] = useState<NodeJS.Timeout | null>(null);




  // ADD DEFAULT VALUE IN PHASE LIST
  const handleAddDefaultPhaseList = () => {
    let phaseData: IPhase[] = [
      {
        id: uuid4(),
        rank: 0,
        phase1: "Conception",
        progress: 0,
        weight: 0,
        listDeliverables: [
          {
            id: uuid4(),
            deliverableName: "Document de cadrage",
          },
        ],
        startDate: projectData?.startDate,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 1,
        phase1: "Réalisation",
        progress: 0,
        weight: 0,
        listDeliverables: [
          {
            id: uuid4(),
            deliverableName: "Signature de mise en production",
          },
        ],
        startDate: undefined,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 2,
        phase1: "Mise en production",
        progress: 0,
        weight: 0,
        listDeliverables: [
          {
            id: uuid4(),
            deliverableName: "Plan de déploiement",
          },
        ],
        startDate: undefined,
        endDate: undefined,
        dependantOf: undefined,
      },
      {
        id: uuid4(),
        rank: 3,
        phase1: "Clôture et maintenance",
        progress: 0,
        weight: 0,
        listDeliverables: [
          {
            id: uuid4(),
            deliverableName: "PV de recette",
          },
        ],
        startDate: undefined,
        endDate: projectData?.endDate ?? undefined,
        dependantOf: undefined,
      },
    ];
    const initialId = phaseData?.[0]?.id;
    setActivePhaseId(initialId);
    setPhaseAndLivrableList(phaseData);
  };

  // REMOVE A PHASE TO THE LIST
//  const handleRemovePhaseList = (phaseId: string) => {
//   const filteredList = phaseAndLivrableList.filter(
//     (phase) => phase.id !== phaseId
//   );

//   setPhaseAndLivrableList(
//     filteredList.map((phase, idx) => ({
//       ...phase,
//       rank: idx,
//     }))
//   );

//   if (activePhaseId === phaseId) {
//     setActivePhaseId(filteredList[0]?.id);
//   }
// };

//Suppression différée avec possibilité d'annulation
const schedulePhaseDeletion = (phaseId: string) => {
  const index = phaseAndLivrableList.findIndex(p => p.id === phaseId);
  if (index === -1) return;

  const phase = phaseAndLivrableList[index];

  // Retirer visuellement la phase
  const updatedList = phaseAndLivrableList.filter(p => p.id !== phaseId);
  setPhaseAndLivrableList(updatedList);
  setActivePhaseId(updatedList[0]?.id);

  // Stocker pour annulation
  setPendingDeletePhase(phase);
  setPendingDeleteIndex(index);

  // Déclencher la suppression définitive après 5s
  const timeout = setTimeout(() => {
    setPendingDeletePhase(null);
    setPendingDeleteIndex(null);
  }, 5000);

  setDeleteTimeoutId(timeout);
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
    setInputErrors((prevErrors) => ({
      ...prevErrors,
      [phaseAndLivrableList.length - 1]: errors,
    }));

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
      progress: 0,
      weight: 0,
      listDeliverables: [
        {
          id: uuid4(),
          deliverableName: "",
        },
      ],
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

            ...(label === "phase" && { phase1: value }),
            ...(label === "startDate" && { startDate: value }),
            ...(label === "endDate" && { endDate: value }),
            ...(label === "depandantOf" && { dependantOf: value }),

            //gestion pondération
            ...(label === "weight" && { weight: Number(value) }),
          }
        : phase
    )
  );
};


  // add another deliverable
  const handleAddLivrable = (index: number) => {
    phaseAndLivrableList?.[index]?.listDeliverables?.push({
      id: uuid4(),
      deliverableName: "",
    });
    setPhaseAndLivrableList([...phaseAndLivrableList]);
  };

  // delete one deliverable
  const handleRemoveLivrable = (phaseId: string, livrableId: string) => {
    const updatedList = phaseAndLivrableList?.map((phase) =>
      phase.id === phaseId
        ? {
            ...phase,
            listDeliverables: phase.listDeliverables.filter(
              (livrable) => livrable.id !== livrableId
            ),
          }
        : phase
    );
    setPhaseAndLivrableList(updatedList);
  };

  const handleLivrableNameChange = (
    phaseId: string,
    livrableId: string,
    livrableName: string
  ) => {
    setPhaseAndLivrableList((prevList) =>
      prevList?.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              listDeliverables: phase.listDeliverables?.map((livrable) =>
                livrable.id === livrableId
                  ? { ...livrable, deliverableName: livrableName }
                  : livrable
              ),
            }
          : phase
      )
    );
  };

  // Fonction pour gérer la fin du glisser-déposer
  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || destination.index === source.index) return;

    const items = Array.from(phaseAndLivrableList);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Mettre à jour les ranks
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index
    }));

    setPhaseAndLivrableList(updatedItems);
  };

  return (
    <form
      className={`space-y-2 transition-all duration-1000 ease-in-out ${
        pageCreate === 3 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
      onSubmit={(e) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;

  if (!form.reportValidity()) return;

  // Aucune phase
  if (phaseAndLivrableList.length === 0) {
    notyf.error("Un projet doit contenir au moins une phase");
    return;
  }

  // ============================
  // RÈGLE MÉTIER : PONDÉRATION
  // ============================
  const totalWeight = phaseAndLivrableList.reduce(
    (sum, phase) => sum + (phase.weight ?? 0),
    0
  );

  if (totalWeight !== 100) {
    notyf.error(
      `La somme des pondérations doit être égale à 100%. Actuellement : ${totalWeight}%`
    );
    return;
  }

  // ============================
  // CALCUL DATE DE FIN PROJET
  // ============================
  let latestEndDate = phaseAndLivrableList.reduce((latest, phase) => {
    if (phase.endDate && latest) {
      const phaseEndDate = new Date(phase.endDate);
      const latestDate = new Date(latest);
      return phaseEndDate > latestDate ? phase.endDate : latest;
    }
    return latest;
  }, projectData.endDate ?? "");

  if (
    latestEndDate &&
    projectData.endDate &&
    new Date(latestEndDate) > new Date(projectData.endDate)
  ) {
    setProjectData((prevData) => ({
      ...prevData,
      endDate: latestEndDate,
    }));
  }

  // Étape suivante
  setPageCreate(4);
}}

    >
      <div className="space-y-4">
        <div>
          <span className="font-semibold tracking-wide">
            PHASES ET LIVRABLES <span className="text-red-500 ml-1">*</span>
          </span>
          <div>
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
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="phases" direction="horizontal">
                  {(provided) => (
                    <div
                      className="flex gap-1 overflow-x-auto pb-2"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        alignItems: 'flex-start',
                        minHeight: '50px'
                      }}
                    >
                      {phaseAndLivrableList?.map((phase, index) => (
                        <Draggable key={String(phase?.id)} draggableId={String(phase?.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                flexShrink: 0,
                                minWidth: '150px'
                              }}
                            >
                              <div className="flex">
                                <div
                                  className={`flex text-base border rounded-md cursor-pointer hover:bg-green-50 dark:hover:bg-green-200 border-green-200 dark:border-green-300 dark:hover:text-green-700 ${
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
                                    {phase.phase1 ? phase.phase1 : `Phase ${index + 1}`}
                                  </span>
                                  <button
                                    type="button"
                                    className="flex items-center justify-center px-3 py-2
                                              text-red-500 hover:bg-red-500 hover:text-white
                                              transition rounded-r-md"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPhaseToDelete({
                                        id: phase.id ?? "",
                                        name: phase.phase1 || `Phase`,
                                      });
                                      setIsConfirmDeletePhaseOpen(true);
                                    }}
                                  >
                                    ✕
                                  </button>

                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {phaseAndLivrableList?.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`${activePhaseId === phase?.id ? "" : "hidden"}`}
                >
                  <div className="grid md:grid-cols-3 gap-4 pb-2 mb-4">
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
                      min={
                        phase?.startDate
                          ? phase.startDate
                          : phaseAndLivrableList?.[index]?.startDate
                      }
                      onChange={(e) => {
                        handlePhaseDataChange("endDate", e.target.value, index);
                      }}
                    />
                    <CustomInput
                      label="Pondération"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={0}
                      max={100}
                      rounded="medium"
                      value={phase.weight ?? ""}
                      help="Pourcentage de contribution de cette phase au projet"
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        handlePhaseDataChange("weight", value.toString(), index);
                      }}
                      required
                      suffix="%"
                    />
                    {phase?.listDeliverables?.map((livrable, index) => (
                      <div key={livrable?.id} className="grid grid-flow-col">
                        <CustomInput
                          label={`Livrable ${index + 1}`}
                          type="text"
                          rounded="medium"
                          placeholder="Ex: dossier de conception"
                          help="Document attendu pour valider la finalité de cette phase"
                          value={livrable?.deliverableName}
                          onChange={(e) => {
                            handleLivrableNameChange(
                              phase?.id ?? "",
                              livrable?.id,
                              e.target.value
                            );
                          }}
                          required
                        />
                        {phase?.listDeliverables?.length > 1 && (
                          <span
                            className="flex border mt-7 items-center justify-center text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                            onClick={() => {
                              handleRemoveLivrable(
                                phase?.id ?? "",
                                livrable?.id
                              );
                            }}
                          >
                            ✕
                          </span>
                        )}
                      </div>
                    ))}
                    


                    <button
                      type="button"
                      className="border mt-7 border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2"
                      onClick={() => {
                        handleAddLivrable(index);
                      }}
                    >
                      + Ajouter un livrable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-red-500 flex flex-col">
          <span
            className={`${phaseAndLivrableList.length > 0 ? "hidden" : ""}`}
          >
            ** Un projet doit contenir au moins une phase pour pouvoir la créer.
          </span>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPageCreate(2)}
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5 text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg dark:bg-transparent dark:hover:bg-boxdark2"
          >
            Précédent
          </button>
          <button
            type="submit"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5 text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
      {/* Modal de confirmation de suppression */}
      {isConfirmDeletePhaseOpen && phaseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg w-full max-w-md p-6 relative">

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Confirmation de suppression
              </h3>

              <button
                onClick={() => {
                  setIsConfirmDeletePhaseOpen(false);
                  setPhaseToDelete(null);
                }}
                className="text-slate-400 hover:text-slate-600
                          dark:text-slate-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Voulez-vous vraiment supprimer la phase&nbsp;
              <span className="font-semibold text-red-600">
                "{phaseToDelete.name}"
              </span>
              ?
            </p>

            <p className="text-xs text-red-500 mb-6">
              <strong>Remarque : </strong> Les tâches et livrables rattachés à cette phase seront également supprimés.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmDeletePhaseOpen(false);
                  setPhaseToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded-md border border-slate-300
                          hover:bg-slate-100 dark:border-strokedark dark:hover:bg-boxdark2"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => {
                  schedulePhaseDeletion(phaseToDelete.id);
                  setIsConfirmDeletePhaseOpen(false);
                  setPhaseToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Supprimer
              </button>

            </div>
          </div>
        </div>
      )}
      {/* Section de suppression différée */}
     {pendingDeletePhase && (
  <div
    className="
      fixed bottom-6 right-6 z-50
      flex items-center gap-4
      bg-emerald-50 text-emerald-800
      border border-emerald-200
      px-5 py-4 rounded-lg shadow-xl
      animate-slide-in
      min-w-[320px]
    "
  >
    {/* Icône */}
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
      ✔
    </div>

    {/* Texte */}
    <div className="flex-1 text-sm">
      <p className="font-medium">
        Phase <span className="font-semibold">{pendingDeletePhase.phase1}</span> supprimée
      </p>
      <p className="text-xs text-emerald-700">
        Vous pouvez annuler cette action
      </p>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3">
      <button
        className="text-emerald-600 hover:underline text-sm font-semibold"
        onClick={() => {
          if (deleteTimeoutId) clearTimeout(deleteTimeoutId);

          setPhaseAndLivrableList(prev => {
            const restored = [...prev];
            restored.splice(pendingDeleteIndex!, 0, pendingDeletePhase);
            return restored.map((p, i) => ({ ...p, rank: i }));
          });

          setActivePhaseId(pendingDeletePhase.id);
          setPendingDeletePhase(null);
          setPendingDeleteIndex(null);
        }}
      >
        Annuler
      </button>

      <button
        onClick={() => {
          setPendingDeletePhase(null);
          setPendingDeleteIndex(null);
        }}
        className="text-emerald-400 hover:text-emerald-600"
      >
        ✕
      </button>
    </div>
  </div>
)}

    </form>
  );
};

export default PhasesAdd;