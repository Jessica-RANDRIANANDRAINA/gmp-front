import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { archiveProject } from "../../../services/Project/ProjectServices";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ArchiveProject = ({
  showModalDelete,
  setShowModalDelete,
  projectsToDetele,
}: {
  showModalDelete: boolean;
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  projectsToDetele: Array<string>;
}) => {
  const [loadingArchive, setLoadingArchive] = useState<boolean>(false);
  const confirmArchiveProject = () => {
    setLoadingArchive(true);
    try {
      archiveProject(projectsToDetele);
      var message =
        projectsToDetele.length === 1
          ? "Le projet a été archivé"
          : "Les projets ont été archivés";
      notyf.success(message);
    } catch (error) {
      console.error(`Error while archiving projects: ${error}`);
      notyf.error(
        "Une erreur est survenue lors de l'archivage du projet"
      );
      notyf.error("Veuillez réessayer plus tard");
    } finally {
      setLoadingArchive(false);
      setShowModalDelete(false);
    }
  };

  return (
    <Modal
      modalOpen={showModalDelete}
      setModalOpen={setShowModalDelete}
      header={`${
        projectsToDetele.length === 1
          ? "Voulez vous vraiment archiver ce projet ?"
          : `Voulez vous vraiment archiver ces ${projectsToDetele.length} projets ?`
      }`}
      heightSize="40vh"
      widthSize="medium"
    >
      <ModalBody>
        <></>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100"
          onClick={() => {
            setShowModalDelete(false);
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          className="border text-xs p-2 rounded-md bg-green-700 text-white font-semibold"
          onClick={confirmArchiveProject}
        >
          {loadingArchive ? (
            <span>
              <BeatLoader size={3} className="mr-2" color={"#fff"} />
            </span>
          ) : null}
          Archiver
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ArchiveProject;
