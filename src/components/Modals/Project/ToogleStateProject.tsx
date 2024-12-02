import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { updateProjectState } from "../../../services/Project";
import { IDecodedToken } from "../../../types/user";
import { BeatLoader } from "react-spinners";
import { decodeToken } from "../../../services/Function/TokenService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ToogleStateProject = ({
  showModal,
  projectId,
  type,
  setShowModal,
}: {
  showModal: boolean;
  projectId: string;
  type: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");

    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }
  }, []);

  const confirmToogleProjectState = async () => {
    setLoading(true);
    try {
      const projectType =
        type === "Débloquer" || type === "Restaurer" ? "En cours" : type;
      await updateProjectState(projectId, projectType, decodedToken?.name);
      notyf.success("Modification réussie");
    } catch (error) {
      console.error(`Error while toogle state project : ${error}`);
      notyf.error("Une erreur est survenue");
      notyf.error("Veuillez réessayer plus tard");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Modal
      modalOpen={showModal}
      setModalOpen={setShowModal}
      header={`${
        type === "Stand by"
          ? "Voulez vous vraiment mettre ce projet en stand by ?"
          : `Voulez vous vraiment ${type} ce projet`
      }`}
      heightSize="40vh"
      widthSize="medium"
    >
      <ModalBody>
        <div></div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
          onClick={() => {
            setShowModal(false);
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          className={`border text-xs p-2 rounded-md  font-semibold bg-green-700 text-white`}
          onClick={confirmToogleProjectState}
          // disabled={projectToArchive && projectToArchive?.length === 0}
        >
          {loading ? (
            <span>
              <BeatLoader size={3} className="mr-2" color={"#fff"} />
            </span>
          ) : null}
          {type}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ToogleStateProject;
