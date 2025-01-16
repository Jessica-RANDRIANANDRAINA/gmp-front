import { useState, useEffect } from "react";
import {
  CustomInput,
  // CustomSelect,
} from "../../../../../components/UIElements";
import { IPhase, IProjectData } from "../../../../../types/Project";
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
  phaseAndLivrableList: Array<IPhase>;
  setPhaseAndLivrableList: React.Dispatch<React.SetStateAction<Array<IPhase>>>;
  projectData: IProjectData;
}) => {
  // const [phasesNames, setPhasesNames] = useState<Array<string | undefined>>(
  //   phaseAndLivrableList.map((phase) => phase.phase1)
  // );
  const [activePhaseId, setActivePhaseId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // setPhasesNames(phaseAndLivrableList.map((phase) => phase.phase1));
    if (!activePhaseId) {
      const initialId = phaseAndLivrableList
        ?.slice()
        ?.filter((phase) => phase?.rank !== undefined)
        ?.sort((a, b) => (a.rank ?? 0) - (b?.rank ?? 0))?.[0]?.id;
      setActivePhaseId(initialId);
    }
  }, [phaseAndLivrableList]);

  // ADD DEFAULT VALUE IN PHASE LIST
  // const handleAddDefaultPhaseList = () => {
  //   let phaseData: IPhase[] = [
  //     {
  //       id: uuid4(),
  //       rank: 0,
  //       phase1: "Conception",
  //       listDeliverables: [
  //         {
  //           id: uuid4(),
  //           deliverableName: "Document de cadrage",
  //         },
  //       ],
  //       startDate: projectData?.startDate,
  //       endDate: undefined,
  //       dependantOf: undefined,
  //     },
  //     {
  //       id: uuid4(),
  //       rank: 1,
  //       phase1: "Réalisation",
  //       listDeliverables: [
  //         {
  //           id: uuid4(),
  //           deliverableName: "Signature de mise en production",
  //         },
  //       ],
  //       startDate: undefined,
  //       endDate: undefined,
  //       dependantOf: undefined,
  //     },
  //     {
  //       id: uuid4(),
  //       rank: 2,
  //       phase1: "Mise en production",
  //       listDeliverables: [
  //         {
  //           id: uuid4(),
  //           deliverableName: "Plan de déploiement",
  //         },
  //       ],
  //       startDate: undefined,
  //       endDate: undefined,
  //       dependantOf: undefined,
  //     },
  //     {
  //       id: uuid4(),
  //       rank: 3,
  //       phase1: "Clôture et maintenance",
  //       listDeliverables: [
  //         {
  //           id: uuid4(),
  //           deliverableName: "PV de recette",
  //         },
  //       ],
  //       startDate: undefined,
  //       endDate: undefined,
  //       dependantOf: undefined,
  //     },
  //   ];
  //   setPhaseAndLivrableList(phaseData);
  //   const initialId = phaseData?.[0]?.id;
  //   setActivePhaseId(initialId);
  //   // const phasesNamesData = phaseData.map((phase) => phase.phase1);
  //   // setPhasesNames(phasesNamesData);
  // };
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

  const handlePhaseDataChange = (
    label: string,
    value: string | undefined,
    index: number
  ) => {
    setPhaseAndLivrableList((prevList) =>
      prevList.map((phase) =>
        phase.rank === index
          ? {
              ...phase,
              [label === "phase"
                ? "phase1"
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

  // ADD PHASE IN THE LIST
  const handleAddPhaseList = () => {
    const highestRank = Math.max(
      ...phaseAndLivrableList?.map((phase) => phase.rank ?? 0)
    );
    let rank = highestRank + 1;
    const id = uuid4();
    let phaseData: IPhase = {
      id: id,
      phase1: "",
      listDeliverables: [
        {
          id: uuid4(),
          deliverableName: "",
        },
      ],
      startDate: undefined,
      endDate: undefined,
      rank,
    };
    setActivePhaseId(id);

    const newPhaseList = [...phaseAndLivrableList, phaseData];
    setPhaseAndLivrableList(newPhaseList);
  };

  // add another deliverable
  const handleAddLivrable = (index: number) => {
    const updatedList = phaseAndLivrableList?.map((phase) => {
      if (phase?.rank === index) {
        return {
          ...phase,
          listDeliverables: [
            ...(phase.listDeliverables || []),
            {
              id: uuid4(),
              deliverableName: "",
            },
          ],
        };
      }
      return phase;
    });
    setPhaseAndLivrableList(updatedList);
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
            {/* <button
              onClick={handleAddDefaultPhaseList}
              type="button"
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Utiliser les valeurs par défaut
            </button> */}
            <button
              type="button"
              onClick={handleAddPhaseList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
            >
              Ajouter une phase
            </button>
            <div className="mt-2 space-y-4">
              <div className="flex flex-wrap gap-1">
                {phaseAndLivrableList
                  ?.slice()
                  ?.filter((phase) => phase?.rank !== undefined)
                  ?.sort((a, b) => (a.rank ?? 0) - (b?.rank ?? 0))
                  ?.map((phase, index) => (
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
                            {phase.phase1 ? phase.phase1 : `Phase ${index + 1}`}
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
              {phaseAndLivrableList
                ?.slice()
                ?.filter((phase) => phase?.rank !== undefined)
                ?.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                ?.map((phase, index) => {
                  return (
                    <div
                      key={phase?.id}
                      className={`${
                        activePhaseId === phase?.id ? "" : "hidden"
                      }`}
                    >
                      <div className="grid md:grid-cols-3 gap-4 pb-2 mb-4">
                        <CustomInput
                          label="Phase"
                          type="text"
                          className="font-bold *:text-emerald-500 dark:*:text-emerald-500"
                          rounded="medium"
                          placeholder="Ex: conception"
                          value={phase?.phase1}
                          onChange={(e) => {
                            if (phase?.id)
                              handlePhaseDataChange(
                                "phase",
                                e.target.value,
                                phase.rank ?? 0
                              );
                          }}
                          required
                        />
                        <CustomInput
                          label="Date début"
                          type="date"
                          rounded="medium"
                          min={projectData?.startDate?.split("T")[0]}
                          value={
                            phase?.startDate
                              ? phase?.startDate?.split("T")[0]
                              : 0
                          }
                          onChange={(e) => {
                            if (phase?.id)
                              handlePhaseDataChange(
                                "startDate",
                                e.target.value,
                                phase.rank ?? 0
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
                          value={
                            phase?.endDate ? phase?.endDate?.split("T")[0] : 0
                          }
                          onChange={(e) => {
                            if (phase?.id)
                              handlePhaseDataChange(
                                "endDate",
                                e.target.value,
                                phase.rank ?? 0
                              );
                          }}
                        />
                        {phase?.listDeliverables?.map((livrable, index) => (
                          <div
                            key={livrable?.id}
                            className="grid grid-flow-col"
                          >
                            <CustomInput
                              label={`Livrable ${index + 1}`}
                              type="text"
                              rounded="medium"
                              placeholder="Ex: dossier de conception"
                              value={livrable?.deliverableName}
                              onChange={(e) => {
                                if (phase?.id)
                                  handleLivrableNameChange(
                                    phase?.id,
                                    livrable?.id,
                                    e.target.value
                                  );
                              }}
                              required
                            />
                            {phase?.listDeliverables?.length > 1 && (
                              <span
                                className="flex border  mt-7 items-center justify-center text-red-500 dark:text-red-400 hover:text-white dark:hover:text-whiten hover:bg-red-500 transition rounded-r-md focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer "
                                onClick={() => {
                                  handleRemoveLivrable(
                                    phase?.id ?? "",
                                    livrable?.id
                                  );
                                  console.log("first");
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
                        {/* <CustomSelect
                          className={`md:col-span-2 ${
                            index === 0 ? "hidden" : ""
                          }`}
                          label="Dépendante de"
                          placeholder="Une phase obligatoire avant celle-ci"
                          data={phasesNames
                            ?.slice()
                            ?.reverse()
                            ?.filter((p) => p != phase?.phase1)}
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
                              phase.rank ?? 0
                            );
                          }}
                        /> */}
                      </div>
                    </div>
                  );
                })}
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
