import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { archiveProject, getProjectByIDs } from "../../../services/Project";
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
  setIsArchiveFinished,
}: {
  showModalDelete: boolean;
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsArchiveFinished: React.Dispatch<React.SetStateAction<boolean>>;
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

  const confirmArchiveProject = async () => {
    setLoadingArchive(true);
    try {
      const prtoArchive = projectToArchive?.map((pr) => pr.id);
      await archiveProject(prtoArchive ?? []);
      setIsArchiveFinished(true);
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
              <p className="flex items-center">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-orange"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.6586 15.493L13.8426 6.04498C13.4589 5.39724 12.762 5 12.0091 5C11.2563 5 10.5593 5.39724 10.1756 6.04498L4.35861 15.493C3.91876 16.1817 3.88094 17.0531 4.25947 17.7773C4.63801 18.5016 5.37505 18.968 6.19161 19H17.8256C18.6422 18.968 19.3792 18.5016 19.7577 17.7773C20.1363 17.0531 20.0985 16.1817 19.6586 15.493Z"
                      className="stroke-orange"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                    <path
                      d="M12.0086 13V8"
                      className="stroke-orange"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>{" "}
                    <path
                      d="M12.0086 16V15"
                      className="stroke-orange"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>{" "}
                  </g>
                </svg>
                <span className="text-orange">
                  Vous n'avez pas les droits requis pour archiver :
                </span>
              </p>
              <ul>
                {projectNoAccess?.map((pr) => (
                  <li key={pr?.id}>{pr.title}</li>
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
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2"
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
