import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { IActivityAdd } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import {
  getProjectByUserId,
  updateTaskActicity,
} from "../../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateTaskActivity = ({
  modalUpdateOpen,
  task,
  setModalUpdateOpen,
  setIsRefreshNeeded,
}: {
  modalUpdateOpen: boolean;
  task: any;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [taskData, setTaskData] = useState<IActivityAdd>({
    id: task?.content?.id,
    title: task?.content?.title,
    description: task?.content?.description,
    dailyEffort: task?.content?.dailyEffort,
    startDate: task?.content?.startDate,
    projectTitle: task?.content?.projectTitle,
    phaseTitle: task?.content?.phaseTitle,
    projectId: task?.content?.projectid,
    phaseId: task?.content?.phaseid,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [projectData, setProjectData] = useState<any>();
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const [initial, setInitial] = useState({
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
  });
  const { monday, friday } = getMondayAndFriday();

  useEffect(() => {
    fetchProjectData();
  }, []);

  // initialize project title and phase title
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) => pr?.id === taskData.projectId
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...taskData,
      projectTitle: project?.title || taskData.projectTitle,
    };

    if (taskData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) => lp.id === taskData.phaseId
      );
      updatedTaskData.phaseTitle = phase?.phase1 || taskData.phaseTitle;
    }

    setTaskData(updatedTaskData);
  }, [projectData]);

  // change list of phase available if projectTitle change and change both project id and phaseId
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) => pr?.title === taskData.projectTitle
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...taskData,
      projectId: project?.id || taskData.projectId,
    };

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.forEach((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });
    if (taskData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) =>
          lp.phase1 === taskData.phaseTitle
      );
      updatedTaskData.phaseId = phase?.id || taskData.phaseId;
    }

    setTaskData(updatedTaskData);
    setPhaseTitle(arrayPhaseTitle);
  }, [taskData?.projectTitle, taskData?.phaseTitle]);

  const fetchProjectData = async () => {
    try {
      if (userid) {
        const projectName: string[] = [];
        const data = await getProjectByUserId(userid);
        data.map((pr: { title: string }) => {
          projectName.push(pr.title);
        });

        var titleProject = "";
        var titlePhase = "";

        data?.map((dt: { id: string; title: string; listPhases: any[] }) => {
          if (dt?.id === task?.content?.projectid) {
            titleProject = dt?.title;
            dt.listPhases.map((ph) => {
              if (ph?.id === task?.content?.phaseid) {
                titlePhase = ph?.phase1;
              }
            });
          }
        });

        setInitial({
          ...initial,
          phaseTitle: titlePhase,
          projectTitle: titleProject,
        });

        setProjectTitle(projectName);
        setProjectData(data);
      }
    } catch (error) {
      console.error(`Error at fetch project data : ${error}`);
    }
  };

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };

  const handleUpdateTaskActivity = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {
        title: taskData.title,
        startDate: taskData.startDate,
        dailyEffort: taskData.dailyEffort,
        type: taskData.type,
        description: taskData.description,
        projectId: taskData.projectId,
        phaseId: taskData.phaseId,
      };
      if (taskData.id) {
        console.log(dataToSend);
        await updateTaskActicity(taskData.id, dataToSend);
        setIsRefreshNeeded(true);
        notyf.success("Modification de l'intercontract réussi");
        handleCloseModal();
      }
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at update activity task : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalUpdateOpen}
      setModalOpen={setModalUpdateOpen}
      header={`${task?.content?.title}`}
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
                value={
                  taskData?.projectTitle === ""
                    ? initial?.projectTitle?.slice(0, 20)
                    : taskData?.projectTitle?.slice(0, 20)
                }
                onValueChange={(e) => {
                  setTaskData({
                    ...taskData,
                    projectTitle: e,
                    phaseTitle: "",
                    phaseId: "",
                  });
                  setInitial({
                    ...initial,
                    phaseTitle: "",
                  });
                }}
              />
              <CustomSelect
                required={true}
                label="Titre de la phase"
                data={phaseTitle}
                value={
                  taskData?.phaseTitle === ""
                    ? initial?.phaseTitle?.slice(0, 20)
                    : taskData?.phaseTitle?.slice(0, 20)
                }
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
                value={
                  taskData?.startDate
                    ? taskData?.startDate?.split("T")?.[0]
                    : ""
                }
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
                  setTaskData({
                    ...taskData,
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
          onClick={handleUpdateTaskActivity}
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
          Valider
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateTaskActivity;
