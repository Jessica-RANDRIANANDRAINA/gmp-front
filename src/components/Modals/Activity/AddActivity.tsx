import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { BeatLoader } from "react-spinners";
import { IActivityAdd } from "../../../types/Project";
import {
  createInterContract,
  createTaskActivity,
  createTransverse,
  getProjectByUserId,
} from "../../../services/Project";
import { v4 as uuid4 } from "uuid";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import { intercontractType, transverseType } from "../../../constants/Activity";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddActivity = ({
  modalOpen,
  setModalOpen,
  setIsActivityFinished,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsActivityFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<IActivityAdd>({
    title: "",
    description: "",
    type: "",
    dailyEffort: 1,
    startDate: undefined,
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
    transverseType: "",
    intercontractType: "",
  });

  const { monday, friday } = getMondayAndFriday();
  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const [projectData, setProjectData] = useState<any>();

  const fetchProjectData = async () => {
    try {
      if (userid) {
        const projectName: string[] = [];
        const data = await getProjectByUserId(userid);
        data.map((pr: { title: string }) => {
          projectName.push(pr.title);
        });

        setProjectTitle(projectName);
        setProjectData(data);
      }
    } catch (error) {
      console.error(`Error at fetch project data : ${error}`);
    }
  };

  useEffect(() => {
    const project = projectData?.filter(
      (pr: { title: string }) => pr?.title === activityData.projectTitle
    );
    const listPhase = project?.[0]?.listPhases;

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.map((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });

    setActivityData({
      ...activityData,
      projectId: project?.[0]?.id,
    });

    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.filter(
        (lp: { phase1: string }) => lp.phase1 === activityData.phaseTitle
      );
      setActivityData({
        ...activityData,
        phaseId: phase?.[0]?.id,
      });
    }

    setPhaseTitle(arrayPhaseTitle);
  }, [activityData.projectTitle, activityData.phaseTitle]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateActivity = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      if (activityData?.type === "Projet") {
        const dataToSend = {
          id,
          title: activityData?.title,
          description: activityData?.description,
          dailyEffort: activityData?.dailyEffort,
          startDate: activityData?.startDate,
          status: "Backlog",
          userid,
          phaseid: activityData?.phaseId,
          projectid: activityData?.projectId,
        };
        await createTaskActivity(dataToSend);
      } else if (activityData?.type === "Transverse") {
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort,
          description: activityData.description,
          startDate: activityData.startDate,
          status: "Backlog",
          title: activityData.title,
          type: activityData.transverseType,
          userid,
        };
        await createTransverse(dataToSend);
      } else {
        const dataToSend = {
          id,
          dailyEffort: activityData.dailyEffort,
          description: activityData.description,
          startDate: activityData.startDate,
          status: "Backlog",
          title: activityData.title,
          type: activityData.intercontractType,
          userid,
        };
        await createInterContract(dataToSend);
      }
      notyf.success("Création de l'activité réussie.");
      setIsActivityFinished(true);
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard.");
      console.error("Error at create activity : ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une activité"
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <>
          <div>
            <CustomInput
              required={true}
              type="text"
              label="Titre"
              rounded="medium"
              className="text-sm"
              value={activityData.title}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  title: e.target.value,
                });
              }}
            />
            <CustomSelect
              required={true}
              label="Type"
              data={["Projet", "Transverse", "Intercontract"]}
              value={activityData.type}
              onValueChange={(e) => {
                setActivityData({
                  ...activityData,
                  type: e,
                });
              }}
            />
            <div
              className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
                activityData.type === "Projet" ? "flex" : "hidden"
              } `}
            >
              <CustomSelect
                required={true}
                label="Titre du projet"
                data={projectTitle}
                value={activityData?.projectTitle}
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    projectTitle: e,
                  });
                }}
              />
              <CustomSelect
                required={true}
                className={` ${
                  activityData?.projectTitle === "" ? "hidden" : ""
                }`}
                label="Titre de la phase"
                data={phaseTitle}
                value={activityData?.phaseTitle?.slice(0, 20)}
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    phaseTitle: e,
                  });
                }}
              />
            </div>
            <div
              className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
                activityData.type === "Transverse" ? "flex" : "hidden"
              } `}
            >
              <CustomSelect
                required={true}
                label="Type de transverse"
                data={transverseType}
                value={activityData.transverseType}
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    transverseType: e,
                  });
                }}
              />
            </div>
            <div
              className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
                activityData.type === "Intercontract" ? "flex" : "hidden"
              } `}
            >
              <CustomSelect
                required={true}
                label="Type d'intercontrat"
                data={intercontractType}
                value={activityData.intercontractType}
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    intercontractType: e,
                  });
                }}
              />
            </div>
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomInput
                required={true}
                type="date"
                label="Au date du"
                rounded="medium"
                className="text-sm"
                min={monday}
                max={friday}
                value={activityData?.startDate}
                onChange={(e) => {
                  setActivityData({
                    ...activityData,
                    startDate: e.target.value,
                  });
                }}
              />
              <CustomInput
                type="number"
                min={1}
                max={8}
                label="Temps a consacré (heures)"
                rounded="medium"
                className="text-sm"
                value={activityData.dailyEffort}
                onChange={(e) => {
                  setActivityData({
                    ...activityData,
                    dailyEffort: parseInt(e.target.value),
                  });
                }}
              />
            </div>

            <CustomInput
              type="textarea"
              label="Description"
              rounded="medium"
              className="text-sm"
              value={activityData.description}
              onChange={(e) => {
                setActivityData({
                  ...activityData,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </>
      </ModalBody>
      <ModalFooter>
        <button
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
          type="button"
          onClick={handleCloseModal}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleCreateActivity}
          className="border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md bg-green-700 hover:opacity-85 text-white font-semibold"
        >
          {isLoading ? (
            <BeatLoader size={5} className="mr-2" color={"#fff"} />
          ) : null}
          Créer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AddActivity;
