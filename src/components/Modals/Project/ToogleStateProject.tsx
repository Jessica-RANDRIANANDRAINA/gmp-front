import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { updateProjectState } from "../../../services/Project";
import { IDecodedToken } from "../../../types/user";
import { BeatLoader } from "react-spinners";
import { decodeToken } from "../../../services/Function/TokenService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useNavigate } from "react-router-dom";
import { IProjectData } from "../../../types/Project";

const notyf = new Notyf({ 
  position: { x: "center", y: "top" },
  duration: 3000
});

// Mapping des états
const projectStates = {
  "Not Started": "Pas commencé",
  "In Progress": "En cours",
  "Completed": "Terminé",
  "Archived": "Archivé",
  "Stand by": "Stand by"
};

// Fonction pour obtenir l'état en anglais à partir du français
// const getEnglishState = (frenchState: string): string => {
//   const entry = Object.entries(projectStates).find(([_, frValue]) => frValue === frenchState);
//   return entry ? entry[0] : frenchState;
// };

// Fonction pour obtenir l'état en français à partir de l'anglais
const getFrenchState = (englishState: string): string => {
  return projectStates[englishState as keyof typeof projectStates] || englishState;
};

const ToogleStateProject = ({
  showModal,
  projectId,
  type,
  setShowModal,
  setIsArchiveFinished,
  projectData,
}: {
  showModal: boolean;
  projectId: string;
  type: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsArchiveFinished: React.Dispatch<React.SetStateAction<boolean>>;
  projectData?: IProjectData;
}) => {
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [loading, setLoading] = useState<boolean>(false);
const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("_au_pr");

    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Token invalide: ${error}`);
      }
    }
  }, []);

   const getStateFromActionType = (actionType: string): string => {
    const stateMap: Record<string, string> = {
      "Débloquer": "In Progress",
      "Reprendre": "In Progress",
      "Restaurer": "In Progress",
      "Commencer/En cours": "In Progress",
      "Rouvrir": "In Progress",
      "Terminer": "Completed",
      "Stand by": "Stand by",
      "Pas commencé": "Not Started",
      "Archiver": "Archived"
    };
    
    return stateMap[actionType] || actionType;
  };

  const confirmToogleProjectState = async () => {
    setLoading(true);
    try {
      const englishState = getStateFromActionType(type);
      const frenchState = getFrenchState(englishState);

       // Ajouter une vérification si l'action est "Terminer"
       if (englishState === "Completed" && projectData?.completionPercentage !== 100) {
        notyf.error("Impossible de terminer le projet : l'avancement n'est pas à 100%");
        return;
      }
      
       await updateProjectState(projectId, englishState, decodedToken?.name);
      setIsArchiveFinished(true);
      notyf.success(`Projet marqué comme "${frenchState}" avec succès`);
      navigate(`/gmp/project/details/${projectId}/details`);
    } catch (error) {
      console.error(`Erreur lors du changement d'état: ${error}`);
      notyf.error("Échec de la modification");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const getModalMessage = (): string => {
    const messages: Record<string, string> = {
      "Débloquer": "Voulez-vous vraiment débloquer ce projet ?",
      "Reprendre": "Voulez-vous vraiment reprendre ce projet ?",
      "Restaurer": "Voulez-vous vraiment restaurer ce projet ?",
      "Commencer": "Voulez-vous vraiment commencer ce projet ?",
      "Rouvrir": "Voulez-vous vraiment rouvrir ce projet ?",
      "Terminer": "Voulez-vous vraiment marquer ce projet comme terminé ?",
      "Stand by": "Voulez-vous vraiment mettre ce projet en stand by ?",
      "Pas commencé": "Voulez-vous vraiment marquer ce projet comme non commencé ?",
      "Archiver": "Voulez-vous vraiment archiver ce projet ?"
    };
    
    return messages[type] || `Voulez-vous vraiment mettre ce projet en état "${type}" ?`;
  };

  return (
    <Modal
      modalOpen={showModal}
      setModalOpen={setShowModal}
      header={getModalMessage()}
      heightSize="40vh"
      widthSize="medium"
    >
      <ModalBody>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Cette action modifiera l'état du projet et sera enregistrée dans l'historique.
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
          onClick={() => setShowModal(false)}
        >
          Annuler
        </button>
        <button
          type="button"
          className={`border text-xs p-2 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 transition-colors ${loading ? 'opacity-75' : ''}`}
          onClick={confirmToogleProjectState}
          disabled={loading}
        >
          {loading ? (
            <BeatLoader size={8} color={"#fff"} />
          ) : (
            type
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ToogleStateProject;