import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { IActivityAdd } from "../../../types/Project";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { BeatLoader } from "react-spinners";
import { CustomInput, CustomSelect } from "../../UIElements";
import { intercontractType, transverseType } from "../../../constants/Activity";
import {
  getProjectByUserId,
  updateIntercontract,
  updateTaskActicity,
  updateTransverse,
} from "../../../services/Project";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateActivity = ({
  modalUpdateOpen,
  activity,
  setModalUpdateOpen,
  setIsRefreshNeeded,
}: {
  modalUpdateOpen: boolean;
  activity: any;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [activityData, setActivityData] = useState<IActivityAdd>({
    id: activity?.content?.id,
    title: activity?.content?.title,
    description: activity?.content?.description,
    type: activity?.content?.type,
    dailyEffort: activity?.content?.dailyEffort,
    startDate: activity?.content?.startDate,
    projectTitle: activity?.content?.projectTitle,
    phaseTitle: activity?.content?.phaseTitle,
    projectId: activity?.content?.projectId,
    phaseId: activity?.content?.phaseId,
    transverseType: activity?.content?.subType,
    intercontractType: activity?.content?.subType,
  });
  const [projectData, setProjectData] = useState<any>();
  const [projectTitle, setProjectTitle] = useState<Array<string>>([]);
  const [phaseTitle, setPhaseTitle] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState({
    projectTitle: "",
    phaseTitle: "",
    projectId: "",
    phaseId: "",
  });
  const { monday, friday } = getMondayAndFriday();

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
          if (dt?.id === activity?.content?.projectid) {
            titleProject = dt?.title;
            dt.listPhases.map((ph) => {
              if (ph?.id === activity?.content?.phaseid) {
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
  useEffect(() => {
    fetchProjectData();
  }, []);
  // initialize project title and phase title
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) => pr?.id === activityData.projectId
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...activityData,
      projectTitle: project?.title || activityData.projectTitle,
    };

    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) => lp.id === activityData.phaseId
      );
      updatedTaskData.phaseTitle = phase?.phase1 || activityData.phaseTitle;
    }

    setActivityData(updatedTaskData);
  }, [projectData]);
  // change list of phase available if projectTitle change and change both project id and phaseId
  useEffect(() => {
    const project = projectData?.find(
      (pr: { title: string; id: string }) =>
        pr?.title === activityData.projectTitle
    );
    const listPhase = project?.listPhases;

    const updatedTaskData = {
      ...activityData,
      projectId: project?.id || activityData.projectId,
    };

    const arrayPhaseTitle: Array<string> = [];
    listPhase?.forEach((lp: { phase1: string; status: string }) => {
      if (lp.status !== "Terminé") {
        arrayPhaseTitle.push(lp?.phase1);
      }
    });
    if (activityData.phaseTitle !== "") {
      const phase = listPhase?.find(
        (lp: { phase1: string; id: string }) =>
          lp.phase1 === activityData.phaseTitle
      );
      updatedTaskData.phaseId = phase?.id || activityData.phaseId;
    }

    setActivityData(updatedTaskData);
    setPhaseTitle(arrayPhaseTitle);
  }, [activityData?.projectTitle, activityData?.phaseTitle]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };
  const handleUpdateActivity = async () => {
    setIsLoading(true);
    try {
      if (activityData?.type === "Transverse") {
        const dataToSend = {
          title: activityData.title,
          startDate: activityData.startDate,
          dailyEffort: activityData.dailyEffort,
          type: activityData.transverseType,
          description: activityData.description,
        };
        if (activityData.id) {
          await updateTransverse(activityData.id, dataToSend);
        }
      } else if (activityData?.type === "Intercontract") {
        const dataToSend = {
          title: activityData.title,
          startDate: activityData.startDate,
          dailyEffort: activityData.dailyEffort,
          type: activityData.intercontractType,
          description: activityData.description,
        };
        if (activityData.id) {
          await updateIntercontract(activityData.id, dataToSend);
        }
      } else {
        const dataToSend = {
          title: activityData.title,
          startDate: activityData.startDate,
          dailyEffort: activityData.dailyEffort,
          description: activityData.description,
          projectId: activityData.projectId,
          phaseId: activityData.phaseId,
        };
        if (activityData.id) {
          await updateTaskActicity(activityData.id, dataToSend);
        }
      }
      setIsRefreshNeeded(true);
      notyf.success("Modification de l'activité réussi");
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at update activity : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalUpdateOpen}
      setModalOpen={setModalUpdateOpen}
      header={`${activity?.content?.title}`}
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
            <CustomInput
              required={true}
              label="Type"
              type="text"
              rounded="medium"
              className="text-sm"
              value={activityData.type}
              disabled={true}
            />
            <div
              className={` w-full *:w-full flex-wrap md:flex-nowrap  gap-2 ${
                activity.content.type === "Projet" ? "flex" : "hidden"
              } `}
            >
              <CustomSelect
                required={true}
                label="Titre du projet"
                data={projectTitle}
                value={
                  activityData?.projectTitle === ""
                    ? initial?.phaseTitle?.slice(0, 20)
                    : activityData?.projectTitle?.slice(0, 20)
                }
                onValueChange={(e) => {
                  setActivityData({
                    ...activityData,
                    projectTitle: e,
                    phaseTitle: "",
                    phaseId: "",
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
                value={
                  activityData?.phaseTitle === ""
                    ? initial?.phaseTitle?.slice(0, 20)
                    : activityData?.phaseTitle?.slice(0, 20)
                }
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
                activity.content.type === "Transverse" ? "flex" : "hidden"
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
                activity.content.type === "InterContract" ? "flex" : "hidden"
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
                value={
                  activityData?.startDate
                    ? activityData?.startDate?.split("T")?.[0]
                    : ""
                }
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
          onClick={handleUpdateActivity}
          className="border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md bg-green-700 hover:opacity-85 text-white font-semibold"
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

export default UpdateActivity;
