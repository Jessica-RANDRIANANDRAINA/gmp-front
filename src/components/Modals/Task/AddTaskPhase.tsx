import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import ListUsers from "../../UIElements/ListUsers";
import { getPhaseById } from "../../../services/Project";
import { IPhase, IUserProject, ITaskAdd } from "../../../types/Project";
import { createTaskPhase } from "../../../services/Project";
import { v4 as uuid4 } from "uuid";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddTaskPhase = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { phaseId, projectId } = useParams();
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [isDropdownUserOpen, setDropDownUserOpen] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);
  const [taskData, setTaskData] = useState<ITaskAdd>({
    title: "",
    description: "",
    priority: "Moyen",
    startDate : undefined,
    dueDate: undefined,
  })
    
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        setPhaseData(data);
        console.log(data);
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };

  useEffect(() => {
    fetchDataPhase();
  }, []);

  const handleAddUser = (user: {
    userid: string | undefined;
    projectid: any;
    role: any;
    name: any;
  }) => {
    if (!assignedPerson.some((u) => u.userid === user.userid)) {
      const formatUser = {
        userid: user.userid,
        projectid: user.projectid,
        role: user.role,
        user: {
          name: user.name,
        },
      };
      setAssignedPerson((prev) => [...prev, formatUser]);
    }
  };

  const handleCreateTask = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      const formatuser = assignedPerson.map((u) => ({
        userid: u.userid,
        taskid: id,
        user: {
          name: u?.user?.name,
        },
      }));
      const dataToSend = {
        id,
        title: taskData?.title,
        description: taskData?.description,
        phaseid: phaseId,
        projectid: projectId,
        priority: taskData?.priority,
        startDate: taskData?.startDate,
        dueDate: taskData?.dueDate,
        listUsers: formatuser,
      };
      await createTaskPhase(dataToSend);
      notyf.success("Création de la tache réussi.");
      handleCloseModal();
    } catch (error) {
      notyf.error(
        "Une erreur s'est produite lors de la création de la tache, veuillez réessayer plus tard."
      );
      console.error(`Error at create task phase: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une tache"
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <>
          <div className="space-y-2">
            <div className="font-semibold text-xs">Assigné à:</div>
            <div className="grid grid-cols-3 place-content-center place-items-stretch">
              <div className="flex  items-center">
                <div>
                  <ListUsers data={assignedPerson} type="show" />
                </div>
                <span
                  onClick={() => {
                    setDropDownUserOpen(!isDropdownUserOpen);
                  }}
                  className="w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 dark:bg-boxdark  hover:bg-zinc-300 border-zinc-200 dark:hover:bg-boxdark2 dark:border-formStrokedark"
                >
                  +
                </span>
                <div
                  className={`absolute top-14  left-0 border dark:border-formStrokedark border-zinc-300 bg-white dark:bg-boxdark2 shadow-lg rounded-md z-50 transition-transform duration-300 ease-in-out ${
                    isDropdownUserOpen ? "scale-100" : "scale-0"
                  }`}
                  style={{ transformOrigin: "top left " }} // Définit l'origine de la transformation
                >
                  {isDropdownUserOpen && (
                    <div className="rounded-md">
                      {phaseData?.userProject
                        ?.filter(
                          (user) =>
                            !assignedPerson.some(
                              (u) => u.userid === user.userid
                            )
                        )
                        ?.map((user) => (
                          <div
                            key={user.userid}
                            className="p-2 first:rounded-t-md last:rounded-b-md hover:bg-zinc-100 dark:hover:bg-boxdark text-xs cursor-pointer"
                            onClick={() => {
                              handleAddUser(user);
                            }}
                          >
                            {user.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <CustomInput
              type="text"
              label="Titre"
              rounded="medium"
              className="text-sm"
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <CustomSelect
              label="Priorité"
              placeholder=""
              data={["Urgent", "Important", "Moyen", "Bas"]}
              value={taskData.priority}
              onValueChange={(e) => {
                setTaskData({
                  ...taskData,
                  priority: e,
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <CustomInput
              type="date"
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={taskData?.startDate}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  startDate: e.target.value,
                });
              }}
            />
            <CustomInput
              type="date"
              label="Date d'échéance"
              className="text-sm"
              rounded="medium"
              value={taskData.dueDate}
              min={taskData?.startDate}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  dueDate: e.target.value,
                });
              }}
            />
          </div>

          <div>
            <CustomInput
              type="textarea"
              label="Description"
              placeholder="Tapez une description ou ajoutez des notes ici"
              rows={8}
              rounded="medium"
              className="text-sm"
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
          onClick={handleCreateTask}
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

export default AddTaskPhase;
