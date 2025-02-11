import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { IPhase, ITaskAdd, IUserTask } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { getInitials } from "../../../services/Function/UserFunctionService";
import { updateTaskProject } from "../../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateTask = ({
  modalUpdateOpen,
  task,
  phaseData,
  setModalUpdateOpen,
  setIsRefreshTaskNeeded,
}: {
  modalUpdateOpen: boolean;
  task: any;
  phaseData: IPhase | null;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshTaskNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [taskData, setTaskData] = useState<ITaskAdd>({
    id: "",
    title: "",
    description: "",
    priority: "Moyen",
    startDate: undefined,
    dueDate: undefined,
    dailyEffort: 1,
    status: "Backlog",
  });
  const userPopUp = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserTask>>([]);
  const [isDropdownUserOpen, setDropDownUserOpen] = useState<boolean>(false);

  // close user pop up if click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!userPopUp.current) return;
      if (userPopUp.current.contains(target)) return;
      setDropDownUserOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    if (task?.content) {
      setTaskData({
        id: task?.content.id,
        title: task?.content?.title || "",
        description: task?.content?.description || "",
        priority: task?.content?.priority || "Moyen",
        startDate: task?.content?.startDate || undefined,
        dueDate: task?.content?.dueDate || undefined,
        dailyEffort: task?.content?.dailyEffort,
        status: task?.content?.status,
      });

      setAssignedPerson(task.content.userTasks);
    }
  }, [task]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };

  const handleUpdateTask = async () => {
    setIsLoading(true);
    try {
      const formatUser = assignedPerson?.map((u) => ({
        userid: u.userid,
        taskid: u.taskid,
        user: {
          name: u.name,
        },
      }));
      const dataToSend = {
        priority: taskData?.priority,
        startDate: taskData?.startDate,
        dueDate: taskData?.dueDate === "" ? undefined : taskData?.dueDate,
        description: taskData?.description,
        listUsers: formatUser,
        dailyEffort: taskData?.dailyEffort,
        title: taskData?.title,
        status: taskData?.status,
      };

      const taskId = task.content.id;
      await updateTaskProject(taskId, dataToSend);
      setIsRefreshTaskNeeded(true);
      notyf.success("Modification de la tâche réussi");
      handleCloseModal();
    } catch (error) {
      notyf.error(
        "Veuillez remplir tous les champs correctement. Si l'erreur persiste, veuillez contacter l'administrateur."
      );
      console.error(`Error at update task:${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = (user: {
    userid: string;
    projectid: any;
    role: any;
    name: any;
  }) => {
    if (!assignedPerson.some((u) => u.userid === user.userid)) {
      const formatUser = {
        userid: user.userid,
        taskid: task.content.id,
        projectid: "",
        name: user.name,
      };
      setAssignedPerson((prev) => [...prev, formatUser]);
    }
  };

  const handleRemoveUser = (userid: string) => {
    let filteredList = assignedPerson.filter((user) => user.userid !== userid);
    setAssignedPerson(filteredList);
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
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="font-semibold text-xs">
              Assigné à : <span className="text-red-500 ml-1 text-sm">*</span>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <div className="space-y-2 w-full  ">
                  <div className="flex flex-wrap w-full gap-1">
                    {assignedPerson?.map((user) => {
                      const initials = getInitials(
                        user?.name ? user?.name : ""
                      );
                      return (
                        <div
                          key={user?.userid}
                          className="relative group  first:ml-0 hover:z-99 cursor-pointer "
                          onClick={() => {
                            handleRemoveUser(user?.userid);
                          }}
                        >
                          <p className="text-slate-50 border relative bg-secondaryGreen p-1 w-7 h-7 flex justify-center items-center text-xs rounded-full dark:text-white dark:border-transparent">
                            {initials}
                          </p>
                          <div className="absolute  whitespace-nowrap text-xs hidden group-hover:block bg-white text-black p-2 border border-whiten shadow-5 rounded-md z-999999 top-[-35px] ">
                            <p>{user?.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    ref={userPopUp}
                    onClick={() => {
                      setDropDownUserOpen(!isDropdownUserOpen);
                    }}
                    className={`w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 dark:bg-boxdark  hover:bg-zinc-300 border-zinc-200 dark:hover:bg-boxdark2 dark:border-formStrokedark ${
                      assignedPerson.length > 0 ? "hidden" : ""
                    }`}
                  >
                    +
                  </div>
                </div>
                <div
                  className={`absolute top-14 max-h-100 overflow-auto left-0 border dark:border-formStrokedark border-zinc-300 bg-white dark:bg-boxdark2 shadow-lg rounded-md z-50 transition-transform duration-300 ease-in-out ${
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
          </div>
          <div className="grid md:grid-cols-2 gap-2">
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
            <CustomSelect
              label="Statut"
              placeholder=""
              data={["Backlog", "En cours", "Traité", "En pause", "Abandonné"]}
              value={taskData.status}
              onValueChange={(e) => {
                setTaskData({
                  ...taskData,
                  status: e,
                });
              }}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            <CustomInput
              required
              type="date"
              label="Date de début"
              rounded="medium"
              className="text-sm"
              value={
                taskData?.startDate ? taskData?.startDate?.split("T")?.[0] : ""
              }
              onChange={(e) => {
                const newStartDate = e.target.value;
                if (
                  taskData?.dueDate &&
                  new Date(newStartDate) > new Date(taskData.dueDate)
                ) {
                  setTaskData({
                    ...taskData,
                    startDate: newStartDate,
                    dueDate: newStartDate,
                  });
                } else {
                  setTaskData({
                    ...taskData,
                    startDate: newStartDate,
                  });
                }
              }}
            />
            <CustomInput
              type="date"
              label="Date d'échéance"
              className="text-sm"
              rounded="medium"
              value={
                taskData?.dueDate ? taskData?.dueDate?.split("T")?.[0] : ""
              }
              min={
                taskData?.startDate
                  ? taskData?.startDate?.split("T")[0]
                  : taskData?.startDate
              }
              onChange={(e) => {
                const newDueDate = e.target.value;
                if (
                  taskData?.startDate &&
                  new Date(newDueDate) < new Date(taskData.startDate)
                ) {
                  setTaskData({
                    ...taskData,
                    dueDate: newDueDate,
                    startDate: newDueDate,
                  });
                } else {
                  setTaskData({
                    ...taskData,
                    dueDate: newDueDate,
                  });
                }
              }}
            />
          </div>
          <CustomInput
            type="number"
            label="Heure consacrée"
            min={1}
            max={8}
            rounded="medium"
            className="text-sm"
            value={taskData?.dailyEffort}
            onChange={(e) => {
              setTaskData({
                ...taskData,
                dailyEffort: parseInt(e.target.value),
              });
            }}
          />

          <div>
            <CustomInput
              type="textarea"
              label="Description"
              placeholder="Tapez une description ou ajoutez des notes ici"
              rows={8}
              rounded="medium"
              className="text-sm"
              value={taskData?.description}
              onChange={(e) => {
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div
          className={`${phaseData?.status === "Terminé" ? "hidden" : "flex"}`}
        >
          <button
            className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
            type="button"
            onClick={handleCloseModal}
          >
            Annuler
          </button>
          {(() => {
            const hasStartDate =
              taskData?.startDate !== "" && taskData?.startDate !== undefined;
            const hasPersonAssigned = assignedPerson.length > 0;
            const isDisabled = hasStartDate && hasPersonAssigned;
            const buttonClassName = !isDisabled
              ? "cursor-not-allowed bg-graydark"
              : "cursor-pointer bg-green-700 hover:opacity-85";

            return (
              <button
                disabled={!isDisabled}
                type="button"
                onClick={handleUpdateTask}
                className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${buttonClassName}`}
              >
                {isLoading ? (
                  <BeatLoader size={5} className="mr-2" color={"#fff"} />
                ) : null}
                Sauvegarder
              </button>
            );
          })()}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateTask;
