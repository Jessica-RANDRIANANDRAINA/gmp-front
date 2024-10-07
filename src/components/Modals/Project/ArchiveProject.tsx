import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import {
  archiveProject,
  getProjectByIDs,
} from "../../../services/Project/ProjectServices";
import { IDecodedToken } from "../../../types/user";
import { IProjectData } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { decodeToken } from "../../../services/Function/TokenService";
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
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [project, setProject] = useState<Array<IProjectData>>();
  const [projectToArchive, setProjectToArchive] =
    useState<Array<IProjectData>>();
  const [projectNoAccess, setprojectNoAccess] = useState<Array<IProjectData>>();

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

  const fetchData = async () => {
    const data = await getProjectByIDs(projectsToDetele);
    setProject(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (project && decodedToken) {
      const filtered = project.filter((pr) =>
        pr?.listUsers?.every(
          (pu) => pu.userid !== decodedToken.jti || pu.role === "director"
        )
      );
      const noAccess = project.filter((pr) =>
        pr?.listUsers?.every(
          (pu) => pu.userid !== decodedToken.jti || pu.role !== "director"
        )
      );
      setprojectNoAccess(noAccess);
      setProjectToArchive(filtered);
    }
  }, [project, decodedToken]);

  const confirmArchiveProject = () => {
    setLoadingArchive(true);
    try {
      const prtoArchive = projectToArchive?.map((pr) => pr.id);
      archiveProject(prtoArchive ?? []);
      var message =
        projectsToDetele.length === 1
          ? "Le projet a été archivé"
          : "Les projets ont été archivés";
      notyf.success(message);
    } catch (error) {
      console.error(`Error while archiving projects: ${error}`);
      notyf.error("Une erreur est survenue lors de l'archivage du projet");
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
        projectToArchive?.length === 0
          ? ""
          : projectNoAccess && projectNoAccess?.length > 0
          ? projectToArchive?.length === 1
            ? "Voulez vous archiver le projet auxquel vous avez accès ?"
            : `Voulez vous archiver les ${projectToArchive?.length} projets auxquels vous avez accès ?`
          : projectToArchive?.length === 1
          ? "Voulez vous vraiment archiver le projet ?"
          : `Voulez vous vraiment archiver ces ${projectToArchive?.length} projets ?`
      }`}
      heightSize="40vh"
      widthSize="medium"
    >
      <ModalBody>
        <div>
          {projectNoAccess && projectNoAccess?.length > 0 ? (
            <div>
              Vous n'avez pas les droits requis pour archiver :
              <ul>
                {projectNoAccess?.map((pr) => (
                  <li>{pr.title}</li>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
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
          className={`border text-xs p-2 rounded-md  font-semibold ${
            projectToArchive && projectToArchive?.length === 0
              ? "bg-zinc-700 cursor-not-allowed text-white"
              : "bg-green-700 text-white"
          }`}
          onClick={confirmArchiveProject}
          disabled={projectToArchive && projectToArchive?.length === 0}
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
