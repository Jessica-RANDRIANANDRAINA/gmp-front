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
      "Débloquer": "Commencer/En cours",
      "Reprendre": "Commencer/En cours",
      "Restaurer": "Commencer/En cours",
      "Commencer/En cours": "Commencer/En cours",
      "Rouvrir": "Commencer/En cours",
      "Terminer": "Terminer",
      "Stand by": "Stand by",
      "Pas commencé": "Pas commencé",
    };
    
    return stateMap[actionType] || actionType;
  };

  const confirmToogleProjectState = async () => {
    setLoading(true);
    try {
      const projectType = getStateFromActionType(type);

       // Ajouter une vérification si l'action est "Terminer"
        if (projectType === "Terminer" && projectData?.completionPercentage !== 100) {
          notyf.error("Impossible de terminer le projet : l'avancement n'est pas à 100%");
          return;
        }
      
      await updateProjectState(projectId, projectType, decodedToken?.name);
      setIsArchiveFinished(true);
      notyf.success(`Projet marqué comme "${projectType}" avec succès`);
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