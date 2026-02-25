// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {CustomInput } from "../../UIElements";
// import { Modal, ModalBody, ModalFooter } from "../Modal";
// import {
//   getPhaseById,
//   getProjectById,
//   updatePhaseSettings,
// } from "../../../services/Project";
// import { decodeToken } from "../../../services/Function/TokenService";
// import { formatDate } from "../../../services/Function/DateServices";
// import { IPhase } from "../../../types/Project";
// import { BeatLoader } from "react-spinners";
// import { Notyf } from "notyf";
// import "notyf/notyf.min.css";
// import { AxiosError } from "axios";

// const notyf = new Notyf({ position: { x: "center", y: "top" } });

// const PhaseSettings = ({
//   showModalSettings,
//   setShowModalSettings,
//   onUpdated,
// }: {
//   showModalSettings: boolean;
//   setShowModalSettings: React.Dispatch<React.SetStateAction<boolean>>;
//   onUpdated?: () => void; 
// }) => {
//   const { phaseId, projectId } = useParams();
//   const [phaseData, setPhaseData] = useState<IPhase>();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [dataToModif, setDataToModif] = useState({
//     status: "A faire",
//     listDeliverables: [],
//   });
//   const [ableToEnd, setAbleToEnd] = useState<boolean>(false);
//   const [datePhase, setDatePhase] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [projectState, setProjectState] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [completionPercentage, setCompletionPercentage] = useState<number>(0);



//   // 🔧 Correction essentielle : normaliser les états backend en anglais
//   const normalizeState = (state: string | undefined | null) => {
//     if (!state) return "Not Started";

//     const map: any = {
//       "Pas commencé": "Not Started",
//       "pas commencé": "Not Started",
//       "En cours": "In Progress",
//       "In Progress": "In Progress",
//       open: "In Progress",
//       "Stand by": "Stand by",
//       "Terminé": "Completed",
//       Completed: "Completed",
//       Archivé: "Archived",
//       Archiver: "Archived",
//     };

//     return map[state] || state;
//   };

//   useEffect(() => {
//     var start = "";
//     var end = "";
//     if (phaseData?.startDate) {
//       start = formatDate(phaseData?.startDate);
//     }
//     if (phaseData?.endDate) {
//       end = formatDate(phaseData?.endDate);
//     }
//     setDatePhase({
//       startDate: start,
//       endDate: end,
//     });
//     if (phaseData?.completionPercentage !== undefined) {
//       setCompletionPercentage(phaseData.completionPercentage);
//     }
//   }, [phaseData]);

//   const fetchDataPhase = async () => {
//     try {
//       if (phaseId) {
//         const data = await getPhaseById(phaseId);
//         const statusArray = ["Backlog", "En cours", "En pause"];

//         const hasIncompleteTask = data?.tasks?.some(
//           (task: { status: string }) => statusArray.includes(task.status)
//         );

//         setAbleToEnd(!hasIncompleteTask);

//         setPhaseData({
//           ...data,
//           listDeliverables: data.listDeliverables ?? [],
//         });
//         setDataToModif({
//           ...dataToModif,
//           status: data?.status ?? "A faire",
//           listDeliverables: data.listDeliverables ?? [],
//         });
//       }
//     } catch (error) {
//       console.error("error at fetch data phase: ", error);
//     }
//   };

//   const fetchProjectState = async () => {
//     try {
//       if (projectId) {
//         const project = await getProjectById(projectId);

//         // 🟩 Étape critique : corriger le statut backend
//         const normalized = normalizeState(project?.state);

//         setProjectState(normalized);
//       }
//     } catch (error) {
//       console.error("Erreur récupération état projet:", error);
//     }
//   };

//   useEffect(() => {
//     fetchDataPhase();
//     fetchProjectState();
//   }, []);

//   const handleLinkChange = (livrableId: string, link: string) => {
//     const userConnected = decodeToken("pr");
//     setPhaseData((prevData) => {
//       if (!prevData) {
//         return prevData;
//       }
//       return {
//         ...prevData,
//         initiator: userConnected?.name,
//         listDeliverables: prevData.listDeliverables.map((livrable) =>
//           livrable.id === livrableId
//             ? { ...livrable, expectedDeliverable: link }
//             : livrable
//         ),
//       };
//     });
//   };

// const handleConfirm = async () => {
//   setIsLoading(true);
//   try {
//     if (phaseId && phaseData) {
//       const userConnected = decodeToken("pr");

//       const payload = {
//         ...phaseData,
//         completionPercentage: completionPercentage, //IMPORTANT
//         initiator: userConnected?.name,
//       };

//       await updatePhaseSettings(phaseId, payload);

//       notyf.success("Modification apportée avec succès");
//       onUpdated?.();
//       setShowModalSettings(false);
//     }
//   } catch (error) {
//     const err = error as AxiosError<{ message: string }>;
//     const message =
//       err?.response?.data?.message ||
//       "Tant que la phase précédente n’est pas terminée, cette phase ne peut pas être modifiée.";

//     setErrorMessage(message);
//   } finally {
//     setIsLoading(false);
//   }
// };


//   // Règle métier : si projet pas commencé → statut unique
// const baseOptions = ["A faire", "En cours", "Stand by"];

// const statusOptions =
//   projectState === "Not Started"
//     ? ["A faire"]
//     : ableToEnd
//     ? [...baseOptions, "Terminé"]
//     : baseOptions; // "Terminé" disparaît si tâches non traitées

// {!ableToEnd && projectState !== "Not Started" && (
//   <div className="p-3 mt-2 text-sm rounded-md bg-red-50 text-red-700 border border-red-300">
//     ⚠️ La phase ne peut pas être terminée tant qu’il reste des activités en
//     <strong> Backlog</strong> ou <strong>En cours</strong>.
//   </div>
// )}

//   return (
//     <Modal
//       modalOpen={showModalSettings}
//       setModalOpen={setShowModalSettings}
//       header={`Phase ${phaseData?.phase1}`}
//       heightSize="80vh"
//       widthSize="medium"
//       overflow=""
//     >
//       <ModalBody>
//         <div className="space-y-2">
//           <div>
//             <div>Date de début : {datePhase?.startDate}</div>
//             <div>Date de fin : {datePhase?.endDate}</div>
//           </div>

//           {/* -------------------- SELECT STATUT -------------------- */}
//           <label className="text-sm font-medium">Statut</label>
//           <select
//             disabled={projectState === "Not Started"} // correction
//             className={`w-full border rounded-md p-2 text-sm 
//               ${
//                 projectState === "Not Started"
//                   ? "bg-gray-100 cursor-not-allowed text-gray-400"
//                   : ""
//               }
//             `}
//             value={phaseData?.status ?? "A faire"}
//             onChange={(e) => {
//               if (projectState === "Not Started") return;

//               const selected = e.target.value;

//               //Correction essentielle : empêcher de terminer si tâches incomplètes
//               if (selected === "Terminé" && !ableToEnd) {
//                 notyf.error(
//                   "Impossible de terminer la phase : des activités sont encore en Backlog ou En cours."
//                 );
//                 return;
//               }

//               const userConnected = decodeToken("pr");

//             let nextProgress = phaseData?.progress ?? 0;

//             if (selected === "A faire") nextProgress = 0;
//             if (selected === "En cours" && nextProgress === 0) nextProgress = 1;
//             if (selected === "Terminé") nextProgress = 100;
//             if (selected === "Stand by") {
//               // on garde progress (gelé) OU tu peux le mettre à la valeur actuelle
//             }

//             setPhaseData({
//               ...phaseData,
//               status: selected,
//               progress: nextProgress,
//               initiator: userConnected?.name,
//               listDeliverables: phaseData?.listDeliverables ?? [],
//             });

//             }}

//           >
//             {statusOptions.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>
//           {/* -------------------- AVANCEMENT PHASE -------------------- */}
// <CustomInput
//   label="Avancement (%)"
//   rounded="medium"
//   type="number"
//     min={0}
//     max={100}
//     value={completionPercentage}
//     onChange={(e) =>
//       setCompletionPercentage(
//         Math.max(0, Math.min(100, Number(e.target.value)))
//       )
//     }
// />

// {/* <div className="mt-3">
//   <label className="block text-sm font-medium mb-1">
//     Avancement de la phase (%)
//   </label>

//   <input
//     type="number"
//     min={0}
//     max={100}
//     value={completionPercentage}
//     onChange={(e) =>
//       setCompletionPercentage(
//         Math.max(0, Math.min(100, Number(e.target.value)))
//       )
//     }
//     className="w-24 rounded border px-2 py-1 text-sm"
//   />
// </div> */}


//           {/* -------------------- LIVRABLES (CORRIGÉ) -------------------- */}
//           {phaseData?.listDeliverables?.map((livrable) => (
//             <CustomInput
//               key={livrable.id}
//               label={`Lien vers le livrable : ${livrable.deliverableName}`}
//               type="text"
//               placeholder="ex : https://lien-vers-le-livrable"
//               rounded="medium"

//               //IMPORTANT : basé sur projectState, pas ableToEnd
//               disabled={projectState === "Not Started"}
//               className={`w-full ${
//                 projectState === "Not Started"
//                   ? "opacity-60 cursor-not-allowed"
//                   : ""
//               }`}
//               help="Quand la phase est terminée veuillez mettre ici le lien vers le livrable attendu"
//               value={livrable?.expectedDeliverable ?? ""}
//               onChange={(e) => {
//                 if (projectState === "Not Started") return;
//                 handleLinkChange(livrable.id, e.target.value);
//               }}
//             />
//           ))}
//         </div>
//       </ModalBody>

//       {/* Message d'avertissement */}
//       {projectState === "Not Started" && (
//         <div className="p-3 mt-4 mb-3 text-sm rounded-md bg-orange-100 text-orange-700 border border-red-600">
//           ⚠️ Le projet n’a pas encore commencé.
//           <br />
//           La modification du statut et des livrables sont désactivée.
//         </div>
//       )}

//       <ModalFooter>
//         <button
//           type="button"
//           className="border text-xs p-2 rounded-md font-semibold bg-transparent border-gray dark:border-formStrokedark hover:bg-zinc-100 dark:hover:bg-boxdark2"
//           onClick={() => {
//             setShowModalSettings(false);
//           }}
//         >
//           Annuler
//         </button>

//         <button
//           type="button"
//           disabled={projectState === "Not Started"} // correction
//           className={`border flex justify-center items-center text-xs p-2 rounded-md font-semibold 
//             ${
//               projectState === "Not Started"
//                 ? "bg-green-500 border-gray-300 text-white cursor-not-allowed opacity-70"
//                 : "text-white border-primaryGreen bg-primaryGreen dark:border-darkgreen dark:bg-darkgreen hover:bg-opacity-90"
//             }`}
//           onClick={() => {
//             if (projectState !== "Not Started") {
//               handleConfirm();
//             }
//           }}
//         >
//           {isLoading && <BeatLoader size={8} className="mr-2" color="#fff" />}
//           Modifier
//         </button>
       

//       </ModalFooter>
//        {errorMessage && (
//           <div className="
//             mt-4 p-3 rounded-md 
//             bg-red-50 border border-red-400 
//             text-red-700 text-sm
//           ">
//             ❌ {errorMessage}
//           </div>
//         )}
//     </Modal>
//   );
// };

// export default PhaseSettings;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {CustomInput } from "../../UIElements";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import {
  getPhaseById,
  getProjectById,
  updatePhaseSettings,
} from "../../../services/Project";
import { decodeToken } from "../../../services/Function/TokenService";
import { formatDate } from "../../../services/Function/DateServices";
import { IPhase } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { AxiosError } from "axios";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const PhaseSettings = ({
  showModalSettings,
  setShowModalSettings,
  onUpdated,
}: {
  showModalSettings: boolean;
  setShowModalSettings: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: () => void; 
}) => {
  const { phaseId, projectId } = useParams();
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataToModif, setDataToModif] = useState({
    status: "A faire",
    listDeliverables: [],
  });
  const [ableToEnd, setAbleToEnd] = useState<boolean>(false);
  const [datePhase, setDatePhase] = useState({
    startDate: "",
    endDate: "",
  });
  const [projectState, setProjectState] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const isPercentageInitializedRef = React.useRef(false);



  // 🔧 Correction essentielle : normaliser les états backend en anglais
  const normalizeState = (state: string | undefined | null) => {
    if (!state) return "Not Started";

    const map: any = {
      "Pas commencé": "Not Started",
      "pas commencé": "Not Started",
      "En cours": "In Progress",
      "In Progress": "In Progress",
      open: "In Progress",
      "Stand by": "Stand by",
      "Terminé": "Completed",
      Completed: "Completed",
      Archivé: "Archived",
      Archiver: "Archived",
    };

    return map[state] || state;
  };

  useEffect(() => {
    var start = "";
    var end = "";
    if (phaseData?.startDate) {
      start = formatDate(phaseData?.startDate);
    }
    if (phaseData?.endDate) {
      end = formatDate(phaseData?.endDate);
    }
    setDatePhase({
      startDate: start,
      endDate: end,
    });
    
    // ✅ Initialise completionPercentage UNE SEULE FOIS lors du chargement des données
    // Ensuite, ne laisse pas le useEffect réinitialiser cette valeur
    if (!isPercentageInitializedRef.current && phaseData?.completionPercentage !== undefined) {
      setCompletionPercentage(phaseData.completionPercentage);
      isPercentageInitializedRef.current = true;
    }
   
    
  }, [phaseData]);

  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        // ✅ Réinitialise le flag quand on recharge les données du backend
        isPercentageInitializedRef.current = false;
        
        const statusArray = ["Backlog", "En cours", "En pause"];

        const hasIncompleteTask = data?.tasks?.some(
          (task: { status: string }) => statusArray.includes(task.status)
        );

        setAbleToEnd(!hasIncompleteTask);

        setPhaseData({
          ...data,
          listDeliverables: data.listDeliverables ?? [],
        });
        setDataToModif({
          ...dataToModif,
          status: data?.status ?? "A faire",
          listDeliverables: data.listDeliverables ?? [],
        });
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };

  const fetchProjectState = async () => {
    try {
      if (projectId) {
        const project = await getProjectById(projectId);

        // 🟩 Étape critique : corriger le statut backend
        const normalized = normalizeState(project?.state);

        setProjectState(normalized);
      }
    } catch (error) {
      console.error("Erreur récupération état projet:", error);
    }
  };

  useEffect(() => {
    fetchDataPhase();
    fetchProjectState();
  }, []);

  const handleLinkChange = (livrableId: string, link: string) => {
    const userConnected = decodeToken("pr");
    setPhaseData((prevData) => {
      if (!prevData) {
        return prevData;
      }
      return {
        ...prevData,
        initiator: userConnected?.name,
        listDeliverables: prevData.listDeliverables.map((livrable) =>
          livrable.id === livrableId
            ? { ...livrable, expectedDeliverable: link }
            : livrable
        ),
      };
    });
  };

const handleConfirm = async () => {
  setIsLoading(true);
  try {
    if (phaseId && phaseData) {
      const userConnected = decodeToken("pr");

      //  Si le statut est "Terminé", on force le pourcentage à 100 au moment de la confirmation
      const finalPercentage = phaseData.status === "Terminé" ? 100 : completionPercentage;

      //  On met aussi à jour l'affichage du champ pour cohérence visuelle
      if (phaseData.status === "Terminé") {
        setCompletionPercentage(100);
      }

      const payload = {
        ...phaseData,
        completionPercentage: finalPercentage, //IMPORTANT
        initiator: userConnected?.name,
      };

      await updatePhaseSettings(phaseId, payload);

      notyf.success("Modification apportée avec succès");
      onUpdated?.();
      setShowModalSettings(false);
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    const message =
      err?.response?.data?.message ||
      "Tant que la phase précédente n’est pas terminée, cette phase ne peut pas être modifiée.";

    setErrorMessage(message);
  } finally {
    setIsLoading(false);
  }
};


  // Règle métier : si projet pas commencé → statut unique
const baseOptions = ["A faire", "En cours", "Stand by"];

const statusOptions =
  projectState === "Not Started"
    ? ["A faire"]
    : ableToEnd
    ? [...baseOptions, "Terminé"]
    : baseOptions; // "Terminé" disparaît si tâches non traitées

{!ableToEnd && projectState !== "Not Started" && (
  <div className="p-3 mt-2 text-sm rounded-md bg-red-50 text-red-700 border border-red-300">
    ⚠️ La phase ne peut pas être terminée tant qu’il reste des activités en
    <strong> Backlog</strong> ou <strong>En cours</strong>.
  </div>
)}

  return (
    <Modal
      modalOpen={showModalSettings}
      setModalOpen={setShowModalSettings}
      header={`Phase ${phaseData?.phase1}`}
      heightSize="80vh"
      widthSize="medium"
      overflow=""
    >
      <ModalBody>
        <div className="space-y-2">
          <div>
            <div>Date de début : {datePhase?.startDate}</div>
            <div>Date de fin : {datePhase?.endDate}</div>
          </div>

          {/* -------------------- SELECT STATUT -------------------- */}
          <label className="text-sm font-medium">Statut</label>
          <select
            disabled={projectState === "Not Started"} // correction
            className={`w-full border rounded-md p-2 text-sm 
              ${
                projectState === "Not Started"
                  ? "bg-gray-100 cursor-not-allowed text-gray-400"
                  : ""
              }
            `}
            value={phaseData?.status ?? "A faire"}
            onChange={(e) => {
              if (projectState === "Not Started") return;

              const selected = e.target.value;

              //Correction essentielle : empêcher de terminer si tâches incomplètes
              if (selected === "Terminé" && !ableToEnd) {
                notyf.error(
                  "Impossible de terminer la phase : des activités sont encore en Backlog ou En cours."
                );
                return;
              }

              const userConnected = decodeToken("pr");

            let nextProgress = phaseData?.progress ?? 0;
            const previousStatus = phaseData?.status;

             if (selected === "A faire") {
                nextProgress = 0;
                setCompletionPercentage(0);
              } else if (selected === "En cours") {
                if (nextProgress === 0) nextProgress = 1;
                // Si on vient de "Terminé", on réinitialise le pourcentage pour saisie manuelle
                if (previousStatus === "Terminé") {
                  setCompletionPercentage(0);
                }
              } else if (selected === "Terminé") {
                nextProgress = 100;
                // Le 100 sera forcé uniquement au moment du clic "Modifier" dans handleConfirm
              } else if (selected === "Stand by") {
                // Si on vient de "Terminé", on réinitialise le pourcentage pour saisie manuelle
                if (previousStatus === "Terminé") {
                  setCompletionPercentage(0);
                }
              }


            setPhaseData({
              ...phaseData,
              status: selected,
              progress: nextProgress,
              initiator: userConnected?.name,
              listDeliverables: phaseData?.listDeliverables ?? [],
            });

            

            }}

          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {/* -------------------- AVANCEMENT PHASE -------------------- */}
<CustomInput
  label="Avancement (%)"
  rounded="medium"
  type="number"
    min={0}
    max={100}
    value={completionPercentage}
    onChange={(e) =>
      setCompletionPercentage(
        Math.max(0, Math.min(100, Number(e.target.value)))
      )
    }
/>

{/* <div className="mt-3">
  <label className="block text-sm font-medium mb-1">
    Avancement de la phase (%)
  </label>

  <input
    type="number"
    min={0}
    max={100}
    value={completionPercentage}
    onChange={(e) =>
      setCompletionPercentage(
        Math.max(0, Math.min(100, Number(e.target.value)))
      )
    }
    className="w-24 rounded border px-2 py-1 text-sm"
  />
</div> */}


          {/* -------------------- LIVRABLES (CORRIGÉ) -------------------- */}
          {phaseData?.listDeliverables?.map((livrable) => (
            <CustomInput
              key={livrable.id}
              label={`Lien vers le livrable : ${livrable.deliverableName}`}
              type="text"
              placeholder="ex : https://lien-vers-le-livrable"
              rounded="medium"

              //IMPORTANT : basé sur projectState, pas ableToEnd
              disabled={projectState === "Not Started"}
              className={`w-full ${
                projectState === "Not Started"
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
              help="Quand la phase est terminée veuillez mettre ici le lien vers le livrable attendu"
              value={livrable?.expectedDeliverable ?? ""}
              onChange={(e) => {
                if (projectState === "Not Started") return;
                handleLinkChange(livrable.id, e.target.value);
              }}
            />
          ))}
        </div>
      </ModalBody>

      {/* Message d'avertissement */}
      {projectState === "Not Started" && (
        <div className="p-3 mt-4 mb-3 text-sm rounded-md bg-orange-100 text-orange-700 border border-red-600">
          ⚠️ Le projet n’a pas encore commencé.
          <br />
          La modification du statut et des livrables sont désactivée.
        </div>
      )}

      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md font-semibold bg-transparent border-gray dark:border-formStrokedark hover:bg-zinc-100 dark:hover:bg-boxdark2"
          onClick={() => {
            setShowModalSettings(false);
          }}
        >
          Annuler
        </button>

        <button
          type="button"
          disabled={projectState === "Not Started"} // correction
          className={`border flex justify-center items-center text-xs p-2 rounded-md font-semibold 
            ${
              projectState === "Not Started"
                ? "bg-green-500 border-gray-300 text-white cursor-not-allowed opacity-70"
                : "text-white border-primaryGreen bg-primaryGreen dark:border-darkgreen dark:bg-darkgreen hover:bg-opacity-90"
            }`}
          onClick={() => {
            if (projectState !== "Not Started") {
              handleConfirm();
            }
          }}
        >
          {isLoading && <BeatLoader size={8} className="mr-2" color="#fff" />}
          Modifier
        </button>
       

      </ModalFooter>
       {errorMessage && (
          <div className="
            mt-4 p-3 rounded-md 
            bg-red-50 border border-red-400 
            text-red-700 text-sm
          ">
            ❌ {errorMessage}
          </div>
        )}
    </Modal>
  );
};

export default PhaseSettings;
