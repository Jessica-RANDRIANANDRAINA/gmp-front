import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { CustomInput } from "../../../../../components/UIElements";
import { IProjectData, IPhase } from "../../../../../types/Project";
import { v4 as uuid4 } from "uuid";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const PhasesUpdate = ({
  pageCreate,
  setPageCreate,
  phaseAndLivrableList,
  setPhaseAndLivrableList,
  projectData,
}: {
  pageCreate: number;
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  phaseAndLivrableList: IPhase[];
  setPhaseAndLivrableList: React.Dispatch<React.SetStateAction<IPhase[]>>;
  projectData: IProjectData;
}) => {
  const [activePhaseId, setActivePhaseId] = useState<string>("");

  // Initialiser l'ID de phase active
  useEffect(() => {
    if (!activePhaseId && phaseAndLivrableList.length > 0) {
      const sortedPhases = [...phaseAndLivrableList].sort((a, b) => (a.rank || 0) - (b.rank || 0));
      setActivePhaseId(sortedPhases[0].id || "");
    }
  }, [phaseAndLivrableList]);

  // Supprimer une phase
  const handleRemovePhaseList = (phaseId: string, index: number) => {
    const filteredList = phaseAndLivrableList.filter(phase => phase.id !== phaseId);
    setPhaseAndLivrableList(filteredList);
    
    if (activePhaseId === phaseId) {
      const newActiveId = filteredList[index - 1]?.id || filteredList[0]?.id || "";
      setActivePhaseId(newActiveId);
    }
  };

  // Mettre à jour les données d'une phase
  const handlePhaseDataChange = (
    field: keyof IPhase,
    value: string | undefined,
    phaseId: string
  ) => {
    setPhaseAndLivrableList(prevList =>
      prevList.map(phase =>
        phase.id === phaseId ? { ...phase, [field]: value } : phase
      )
    );
  };

  // Ajouter une nouvelle phase
 const handleAddPhaseList = () => {
  const newId = uuid4(); // On génère l'ID d'abord
  const newPhase: IPhase = {
    id: newId,
    phase1: "",
    listDeliverables: [{ id: uuid4(), deliverableName: "" }],
    rank: phaseAndLivrableList.length,
  };
  
  setPhaseAndLivrableList([...phaseAndLivrableList, newPhase]);
  setActivePhaseId(newId); // On utilise directement la variable newId
};

  // Gestion des livrables
  const handleAddLivrable = (phaseId: string) => {
    setPhaseAndLivrableList(prevList =>
      prevList.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              listDeliverables: [
                ...phase.listDeliverables,
                { id: uuid4(), deliverableName: "" },
              ],
            }
          : phase
      )
    );
  };

  const handleRemoveLivrable = (phaseId: string, livrableId: string) => {
    setPhaseAndLivrableList(prevList =>
      prevList.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              listDeliverables: phase.listDeliverables.filter(
                livrable => livrable.id !== livrableId
              ),
            }
          : phase
      )
    );
  };

  const handleLivrableNameChange = (
    phaseId: string,
    livrableId: string,
    value: string
  ) => {
    setPhaseAndLivrableList(prevList =>
      prevList.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              listDeliverables: phase.listDeliverables.map(livrable =>
                livrable.id === livrableId
                  ? { ...livrable, deliverableName: value }
                  : livrable
              ),
            }
          : phase
      )
    );
  };

  // Gestion du drag and drop
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const sortedPhases = [...phaseAndLivrableList].sort((a, b) => (a.rank || 0) - (b.rank || 0));
    const [movedPhase] = sortedPhases.splice(source.index, 1);
    sortedPhases.splice(destination.index, 0, movedPhase);

    const updatedPhases = sortedPhases.map((phase, index) => ({
      ...phase,
      rank: index,
    }));

    setPhaseAndLivrableList(updatedPhases);
  };

  return (
    <form
      className={`space-y-2 transition-all duration-300 ease-in-out ${
        pageCreate === 3 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        if (phaseAndLivrableList.length > 0) {
          setPageCreate(4);
        } else {
          notyf.error("Un projet doit contenir au moins une phase");
        }
      }}
    >
      <div className="space-y-4">
        <div>
          <span className="font-semibold tracking-wide">
            PHASES ET LIVRABLES <span className="text-red-500 ml-1">*</span>
          </span>
          <div className="hide-scrollbar overflow-y-scroll xl:max-h-125 max-h-100">
            <button
              type="button"
              onClick={handleAddPhaseList}
              className="py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2"
            >
              Ajouter une phase
            </button>
            <div className="mt-2 space-y-4">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="phases" direction="horizontal">
                  {(provided) => (
                    <div
                      className="flex gap-1 overflow-x-auto pb-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ display: 'flex', flexWrap: 'nowrap' }}
                    >
                      {[...phaseAndLivrableList]
                        .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                        .map((phase, index) => (
                          <Draggable
                            key={`phase-${phase.id}`}
                            draggableId={`phase-${phase.id}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  flexShrink: 0,
                                }}
                              >
                                <div className="flex">
                                  <div
                                    className={`flex text-base border rounded-md cursor-pointer hover:bg-green-50 dark:hover:bg-green-200 border-green-200 dark:border-green-300 dark:hover:text-green-700 ${
                                      activePhaseId === phase.id
                                        ? "dark:bg-green-200 bg-green-100 text-green-500 dark:text-green-600 dark:border-2 font-semibold"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300 font-medium"
                                      onClick={() => setActivePhaseId(phase.id || "")}
                                    >
                                      {phase.phase1 || `Phase ${index + 1}`}
                                    </span>
                                    <button
                                      className="flex items-center justify-center px-3 py-2 text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePhaseList(phase.id || "", index);
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

              {[...phaseAndLivrableList]
                .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                .map((phase, index) => (
                  <div
                    key={`phase-details-${phase.id}`}
                    className={activePhaseId === phase.id ? "" : "hidden"}
                  >
                    <div className="grid md:grid-cols-3 gap-4 pb-2 mb-4">
                      <CustomInput
                        label="Phase"
                        type="text"
                        className="font-bold *:text-emerald-500 dark:*:text-emerald-500"
                        rounded="medium"
                        placeholder="Ex: conception"
                        value={phase.phase1 || ""}
                        onChange={(e) =>
                          handlePhaseDataChange("phase1", e.target.value, phase.id || "")
                        }
                        required
                      />
                      <CustomInput
                        label="Date début"
                        type="date"
                        rounded="medium"
                        min={projectData?.startDate?.split("T")[0]}
                        value={phase.startDate?.split("T")[0] || ""}
                        onChange={(e) =>
                          handlePhaseDataChange("startDate", e.target.value, phase.id || "")
                        }
                      />
                      <CustomInput
                        label="Date fin"
                        type="date"
                        rounded="medium"
                        min={phase.startDate?.split("T")[0]}
                        value={phase.endDate?.split("T")[0] || ""}
                        onChange={(e) =>
                          handlePhaseDataChange("endDate", e.target.value, phase.id || "")
                        }
                      />

                      {phase.listDeliverables?.map((livrable, livrableIndex) => (
                        <div key={`livrable-${livrable.id}`} className="grid grid-flow-col">
                          <CustomInput
                            label={`Livrable ${livrableIndex + 1}`}
                            type="text"
                            rounded="medium"
                            placeholder="Ex: dossier de conception"
                            value={livrable.deliverableName || ""}
                            onChange={(e) =>
                              handleLivrableNameChange(phase.id || "", livrable.id || "", e.target.value)
                            }
                            required
                          />
                          {phase.listDeliverables.length > 1 && (
                            <span
                              className="flex border mt-7 items-center justify-center text-red-500 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                              onClick={() => handleRemoveLivrable(phase.id || "", livrable.id || "")}
                            >
                              ✕
                            </span>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        className="border mt-7 border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2"
                        onClick={() => handleAddLivrable(phase.id || "")}
                      >
                        + Ajouter un livrable
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {phaseAndLivrableList.length === 0 && (
          <div className="text-red-500">
            ** Un projet doit contenir au moins une phase pour pouvoir la créer.
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPageCreate(2)}
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5 text-center font-semibold text-zinc-700 dark:text-white hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg dark:bg-transparent dark:hover:bg-boxdark2"
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
    </form>
  );
};

export default PhasesUpdate;