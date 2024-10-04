import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import {
  archiveProject,
  getProjectByIDs,
} from "../../../services/Project/ProjectServices";
import { IDecodedToken } from "../../../types/user";
import { BeatLoader } from "react-spinners";
import { decodeToken } from "../../../services/Function/TokenService";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

// data:[{…}]
// 0
// :
// beneficiary
// :
// ""
// completionPercentage
// :
// null
// createdAt
// :
// null
// criticality
// :
// null
// description
// :
// ""
// endDate
// :
// null
// id
// :
// "8ebb8431-155a-46a4-883f-abc4f6fe7982"
// initiator
// :
// ""
// isEndDateImmuable
// :
// null
// listBudgets
// :
// []
// listHistoricProjects
// :
// []
// listPhases
// :
// []
// listRessources
// :
// []
// listUsers
// :
// Array(4)
// 0
// :
// projectid
// :
// "8ebb8431-155a-46a4-883f-abc4f6fe7982"
// role
// :
// "member"
// user
// :
// null
// userid
// :
// "4a71606b-673d-4ea9-bddc-3121a1313539"
// [[Prototype]]
// :
// Object
// 1
// :
// projectid
// :
// "8ebb8431-155a-46a4-883f-abc4f6fe7982"
// role
// :
// "member"
// user
// :
// null
// userid
// :
// "6b9efa34-aa61-4dfe-8691-ef5f74557989"
// [[Prototype]]
// :
// Object
// 2
// :
// projectid
// :
// "8ebb8431-155a-46a4-883f-abc4f6fe7982"
// role
// :
// "director"
// user
// :
// null
// userid
// :
// "9a9dcfed-d5a8-45c9-8be9-0acacf29ae56"
// [[Prototype]]
// :
// Object
// 3
// :
// projectid
// :
// "8ebb8431-155a-46a4-883f-abc4f6fe7982"
// role
// :
// "observator"
// user
// :
// null
// userid
// :
// "c894ab8a-7e91-41c9-8102-5eef8d8e99a0"
// [[Prototype]]
// :
// Object
// length
// :
// 4
// [[Prototype]]
// :
// Array(0)
// priority
// :
// ""
// startDate
// :
// null
// state
// :
// null
// title
// :
// "KIZARI"
// [[Prototype]]
// :
// Object
// length
// :
// 1
// [[Prototype]]
// :
// Array(0)

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
  const [project, setProject] = useState<any>();

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
      console.log(project);
    }
  }, [project, decodedToken]);

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
