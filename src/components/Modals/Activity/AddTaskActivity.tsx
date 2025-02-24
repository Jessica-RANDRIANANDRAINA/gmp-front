import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { BeatLoader } from "react-spinners";
import { v4 as uuid4 } from "uuid";
import { IActivityAdd } from "../../../types/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import {
  createTaskActivity,
  getProjectByUserId,
} from "../../../services/Project";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddTaskActivity = ({
  modalOpen,
  setModalOpen,
  setIsAddFinished,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { monday, friday } = getMondayAndFriday();
  const [taskData, setTaskData] = useState<IActivityAdd>({
    title: "",
    description: "",
    dailyEffort: 1,
    startDate: "",
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
  });
  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [projectData, setProjectData] = useState<any>();
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
      (pr: { title: string }) => pr?.title === taskData.projectTitle
    );
    const listPhase = project?.[0]?.listPhases;

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.map((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });
    setTaskData({
      ...taskData,
      projectId: project?.[0]?.id,
    });

    if (taskData.phaseTitle !== "") {
      const phase = listPhase?.filter(
        (lp: { phase1: string }) => lp.phase1 === taskData.phaseTitle
      );
      setTaskData({
        ...taskData,
        phaseId: phase?.[0]?.id,
      });
    }
    setPhaseTitle(arrayPhaseTitle);
  }, [taskData.projectTitle, taskData.phaseTitle]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleCreateTaskActivity = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      const dataToSend = {
        id,
        dailyEffort: taskData.dailyEffort,
        description: taskData.description,
        startDate: taskData.startDate,
        status: "Backlog",
        title: taskData.title,
        userid,
        projectid: taskData.projectId,
        phaseid: taskData.phaseId,
      };
      await createTaskActivity(dataToSend);
      notyf.success("Création de la tâche réussie.");

      setIsAddFinished(true);
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard.");
      console.error(`Error at create task activity: ${error}`);
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
              value={taskData.title}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                });
              }}
            />
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomSelect
                required={true}
                label="Titre du projet"
                data={projectTitle}
                value={taskData?.projectTitle?.slice(0, 20)}
                onValueChange={(e) => {
                  setTaskData({
                    ...taskData,
                    projectTitle: e,
                    phaseTitle: "",
                    phaseId: "",
                  });
                }}
              />
              <CustomSelect
                required={true}
                className={`${taskData?.projectTitle === "" ? "hidden" : ""}`}
                label="Titre de la phase"
                data={phaseTitle}
                value={taskData?.phaseTitle?.slice(0, 20)}
                onValueChange={(e) => {
                  setTaskData({
                    ...taskData,
                    phaseTitle: e,
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
                value={taskData?.startDate}
                onChange={(e) => {
                  setTaskData({
                    ...taskData,
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
                value={taskData.dailyEffort}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (value > 8) value = 8;
                  if (value < 1) value = 1;
                  setTaskData({
                    ...taskData,
                    dailyEffort: value,
                  });
                }}
              />
            </div>
            <CustomInput
              type="textarea"
              label="Description"
              rounded="medium"
              className="text-sm"
              rows={5}
              value={taskData.description}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
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
          disabled={
            taskData?.title !== "" &&
            taskData?.projectId !== "" &&
            taskData?.phaseId !== "" &&
            taskData.startDate !== ""
              ? false
              : true
          }
          onClick={handleCreateTaskActivity}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
            taskData?.title !== "" &&
            taskData?.projectId !== "" &&
            taskData?.phaseId !== "" &&
            taskData.startDate !== ""
              ? "cursor-pointer bg-green-700 hover:opacity-85"
              : "cursor-not-allowed bg-graydark"
          }`}
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

export default AddTaskActivity;
