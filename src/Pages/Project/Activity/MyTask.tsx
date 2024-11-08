import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { SignalRContext } from "./Activity";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { formatDate } from "../../../services/Function/DateServices";
import {
  deleteTaskActivity,
  getTaskActivityByUserId,
} from "../../../services/Project";
import AddTaskActivity from "../../../components/Modals/Activity/AddTaskActivity";
import UpdateTaskActivity from "../../../components/Modals/Activity/UpdateTaskActivity";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

// function to organize task in column by status
const organizeTaskByStatus = (tasks: any[]) => {
  const columns: {
    [key: string]: { id: string; title: string; taskIds: string[] };
  } = {
    "column-1": { id: "column-1", title: "Backlog", taskIds: [] },
    "column-2": { id: "column-2", title: "En cours", taskIds: [] },
    "column-3": { id: "column-3", title: "Traité", taskIds: [] },
    "column-4": { id: "column-4", title: "En pause", taskIds: [] },
    "column-5": { id: "column-5", title: "Abandonné", taskIds: [] },
  };

  const taskMap = tasks.reduce((acc, task) => {
    acc[task.id] = {
      id: task.id,
      content: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        startDate: task.startDate,
        type: task.type,
        dailyEffort: task.dailyEffort,
        projectid: task.projectid,
        phaseid: task.phaseid,
      },
    };
    const columnKey = Object.keys(columns).find(
      (key) => columns[key].title === task.status
    );
    if (columnKey) {
      columns[columnKey].taskIds.push(task.id);
    }
    return acc;
  }, {} as { [key: string]: { id: string; content: { startDate: string; dailyEffort: number; type: string; status: string; description: string; title: string; id: string } } });
  return { taskMap, columns };
};

const MyTask = () => {
  const { userid } = useParams();
  const [data, setData] = useState<any>({
    tasks: {},
    columns: {},
    columnOrder: [],
  });
  const connection = useContext(SignalRContext);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<any>();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const deletePopUp = useRef<any>(null);

  // close delete pop up when click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!deletePopUp.current) return;
      if (!deletePopUp || deletePopUp.current.contains(target)) return;
      setActiveTaskId("");
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // get all transverse data of the connected user
  const fetchData = async () => {
    try {
      if (userid) {
        const response = await getTaskActivityByUserId(userid);
        const { taskMap, columns } = organizeTaskByStatus(response);
        setData({
          tasks: taskMap,
          columns,
          columnOrder: [
            "column-1",
            "column-2",
            "column-3",
            "column-4",
            "column-5",
          ],
        });
      }
    } catch (error) {
      console.error(`Error at fetch task activity data: ${error}`);
    }
  };

  // connect signalR in activityHub
  useEffect(() => {
    fetchData();
    setIsRefreshNeeded(false);
  }, [isRefreshNeeded, connection]);

  // when task deleted refetchData by using signal R
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveTaskActivityDeleted", () => {
        fetchData();
      });
    }
    return () => {
      if (connection) {
        connection.off("ReceiveTaskActivityDeleted");
      }
    };
  }, [connection]);

  const handleOnDragEnd = async (result: {
    destination: any;
    source: any;
    draggableId: any;
  }) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data?.columns[source.droppableId];
    const endColumn = data?.columns[destination.droppableId];

    // Moving within the same column
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data?.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving between columns
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);

      const newEnd = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data?.columns,
          [newStart.id]: newStart,
          [newEnd.id]: newEnd,
        },
      });
      if (connection) {
        try {
          await connection.invoke(
            "TaskActivityMoved",
            draggableId,
            startColumn.title,
            endColumn.title
          );
          fetchData();
        } catch (error) {
          console.error(`Error at calling task activity moved: ${error}`);
        }
      }
    }
  };

  const handleToogleMenuDelete = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
  };

  const handleDeleteTaskActivity = async (taskId: string) => {
    try {
      await deleteTaskActivity(taskId);
      notyf.success("Activité supprimée");
      if (connection) {
        try {
          await connection.invoke("TaskActivityDeleted", taskId);
        } catch (error) {
          console.error(
            `Error while sending event TaskActivityDeleted : ${error}`
          );
        }
      }
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer.");
      console.error(`Error at handle delete task activity: ${error}`);
    }
  };

  return (
    <div className={`p-5`}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: "flex" }}>
          {data?.columnOrder?.map((columnId: string) => {
            const column = data?.columns[columnId];
            const tasks = column?.taskIds?.map(
              (taskIds: string | number) => data?.tasks[taskIds]
            );

            return (
              <div className="w-full" key={column.id}>
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className="m-2 rounded-md w-full p-2 "
                      {...provided.droppableProps}
                    >
                      <h3 className="mb-3 text-sm">{column.title}</h3>
                      {tasks?.map((task: any, index: any) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            const endDate = formatDate(task.content.startDate);
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 mb-1 relative shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500 text-xs rounded-md  ${
                                  snapshot.isDragging
                                    ? "bg-green-50 dark:bg-emerald-100"
                                    : "bg-white dark:bg-boxdark"
                                }`}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                                onClick={() => {
                                  setTaskData(task);
                                  setIsModalUpdateOpen(true);
                                }}
                              >
                                <div
                                  className="absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer"
                                  onClick={(e) => {
                                    handleToogleMenuDelete(task.id, e);
                                  }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <g id="SVGRepo_bgCarrier"></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      <path
                                        d="M12 13.75C12.9665 13.75 13.75 12.9665 13.75 12C13.75 11.0335 12.9665 10.25 12 10.25C11.0335 10.25 10.25 11.0335 10.25 12C10.25 12.9665 11.0335 13.75 12 13.75Z"
                                        className="fill-black dark:fill-white"
                                      ></path>{" "}
                                      <path
                                        d="M19 13.75C19.9665 13.75 20.75 12.9665 20.75 12C20.75 11.0335 19.9665 10.25 19 10.25C18.0335 10.25 17.25 11.0335 17.25 12C17.25 12.9665 18.0335 13.75 19 13.75Z"
                                        className="fill-black dark:fill-white"
                                      ></path>{" "}
                                      <path
                                        d="M5 13.75C5.9665 13.75 6.75 12.9665 6.75 12C6.75 11.0335 5.9665 10.25 5 10.25C4.0335 10.25 3.25 11.0335 3.25 12C3.25 12.9665 4.0335 13.75 5 13.75Z"
                                        className="fill-black dark:fill-white"
                                      ></path>{" "}
                                    </g>
                                  </svg>
                                </div>
                                {/* pop up menu delete */}
                                {activeTaskId === task.id && (
                                  <div
                                    ref={deletePopUp}
                                    className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTaskActivity(task.id);
                                        console.log(
                                          "delete task id: ",
                                          task.id
                                        );
                                      }}
                                      className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                )}
                                {/* pop up menu delete */}

                                <div className="flex gap-1">
                                  <span
                                    className={`${
                                      task.content.status === "Traité"
                                        ? ""
                                        : "hidden"
                                    }`}
                                  >
                                    <svg
                                      width="17"
                                      height="17"
                                      viewBox="0 0 24 24"
                                      className="fill-green-500"
                                    >
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        strokeWidth="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <circle
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          className="stroke-green-500"
                                          strokeWidth="1.5"
                                        ></circle>{" "}
                                        <path
                                          d="M8.5 12.5L10.5 14.5L15.5 9.5"
                                          className="stroke-white"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></path>{" "}
                                      </g>
                                    </svg>
                                  </span>
                                  <div className="grid grid-flow-row gap-2 ">
                                    <div>{task.content.title}</div>
                                    <div className="flex flex-wrap gap-1">
                                      <div className="border text-slate-700 dark:text-whiten rounded-full w-7 h-5 flex justify-center items-center">
                                        {task.content.dailyEffort}h
                                      </div>
                                      {/* <div className="border text-slate-700 dark:text-whiten rounded-full w-fit px-1 h-5 flex justify-center items-center">
                                        {task.content.type}
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={` pt-1 mt-2 text-xs ${
                                    task.content.priority === "Moyen" ||
                                    task.content.priority === "Bas"
                                      ? "hidden "
                                      : "text-orange"
                                  }`}
                                >
                                  {task.content.priority}
                                </div>
                                <div
                                  className={`border-t border-t-zinc-200 pt-1 mt-2 text-xs ${
                                    endDate === "--" ? "hidden" : ""
                                  }`}
                                >
                                  {endDate}
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {columnId === "column-1" && (
                  <div
                    className="border ml-4 p-1 cursor-pointer border-slate-300 hover:bg-slate-100 dark:hover:bg-boxdark2 flex justify-center text-xs"
                    onClick={() => {
                      setIsModalAddOpen(true);
                    }}
                  >
                    <span>+ ajouter une activité</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {isModalAddOpen && (
        <AddTaskActivity
          modalOpen={isModalAddOpen}
          setModalOpen={setIsModalAddOpen}
          setIsAddFinished={setIsRefreshNeeded}
        />
      )}
      {isModalUpdateOpen && (
        <UpdateTaskActivity
          modalUpdateOpen={isModalUpdateOpen}
          setModalUpdateOpen={setIsModalUpdateOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          task={taskData}
        />
      )}
    </div>
  );
};

export default MyTask;
