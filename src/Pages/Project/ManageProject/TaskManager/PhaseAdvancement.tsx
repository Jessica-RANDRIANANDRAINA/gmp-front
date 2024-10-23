import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import AddTaskPhase from "../../../../components/Modals/Task/AddTaskPhase";
import UpdateTask from "../../../../components/Modals/Task/UpdateTask";
import {
  getTaskByProjectAndPhaseID,
  getPhaseById,
  deletetaskProject,
} from "../../../../services/Project";
import { IPhase } from "../../../../types/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

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
        title: task.title,
        id: task.id,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        dueDate: task.dueDate,
        userTasks: task.userTasks,
      },
    };
    const columnKey = Object.keys(columns).find(
      (key) => columns[key].title === task.status
    );
    if (columnKey) {
      columns[columnKey].taskIds.push(task.id);
    }
    return acc;
  }, {} as { [key: string]: { id: string; content: { title: string; id: string } } });
  return { taskMap, columns };
};

const PhaseAdvancement = () => {
  const { projectId, phaseId } = useParams();
  const [data, setData] = useState<any>({
    tasks: {},
    columns: {},
    columnOrder: [],
  });
  const [taskData, setTaskData] = useState<any>();
  // const [isAddTaskFinished, setIsAddTaskFinished] = useState<boolean>(false);
  const [isRefreshTaskNeeded, setIsRefreshTaskNeeded] =
    useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState<boolean>(false);
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const deletePopUp = useRef<any>(null);

  // close delete pop up if click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!deletePopUp.current) return;
      if (!deletePopUp || deletePopUp.current.contains(target)) return;
      setActiveTaskId("");
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // fetch data phase to get user asociated with the project
  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        setPhaseData(data);
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };

  // fetch data of the phase to get all task associated to the task
  const fetchData = async () => {
    try {
      if (projectId && phaseId) {
        const response = await getTaskByProjectAndPhaseID(projectId, phaseId);
        // const tasks = await response.json();
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
      console.error(`Error at fetch task data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataPhase();
    setIsRefreshTaskNeeded(false);

    const connect = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_ENDPOINT}/taskHub`)
        .withAutomaticReconnect()
        .build();

      newConnection.on("ReceiveMessage", (user: string, message: string) => {
        console.log(`Message reçue 5/5 de ${user}: ${message}`);
      });

      try {
        await newConnection.start();
        setConnection(newConnection);
        console.log("CONNECTED TO SIGNALR HUB");
      } catch (error) {
        console.error("Erreur de connection au hub", error);
      }
    };

    connect();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [phaseId, isRefreshTaskNeeded]);

  useEffect(() => {
    if (connection) {
      connection.on("ReceiveTaskDeleted", (taskId: string) => {
        fetchData();
        console.log(`Task ${taskId} deleted`);
      });
    }
    return () => {
      if (connection) {
        connection.off("ReceiveTaskDeleted");
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
          ...data.columns,
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
          ...data.columns,
          [newStart.id]: newStart,
          [newEnd.id]: newEnd,
        },
      });
      if (connection) {
        try {
          await connection.invoke(
            "TaskMoved",
            draggableId,
            startColumn.title,
            endColumn.title
          );
        } catch (error) {
          console.error(`Error at calling task moved: ${error}`);
        }
      }
    }
  };

  const handleToogleMenuDelete = (taskId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deletetaskProject(taskId);
      notyf.success("Tache supprimé");

      if (connection) {
        try {
          await connection.invoke("TaskDeleted", taskId);
        } catch (error) {
          console.error(`Error while sending event TaskDeleted: ${error}`);
        }
      }
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer.");
      console.error(`Error at handle delete task: ${error}`);
    }
  };

  return (
    <div className="p-5 ">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div style={{ display: "flex" }}>
          {data.columnOrder.map((columnId: string) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(
              (taskId: string | number) => data.tasks[taskId]
            );

            return (
              <div className="w-full">
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className="m-2 rounded-md w-full p-2 "
                      {...provided.droppableProps}
                    >
                      <h3 className="mb-3 text-sm">{column.title}</h3>
                      {tasks.map((task: any, index: any) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
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
                                setModalUpdateOpen(true);
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
                                      handleDeleteTask(task.id);
                                      console.log("delete task id: ", task.id);
                                    }}
                                    className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              )}
                              {/* pop up menu delete */}
                              {task.content.title}
                            </div>
                          )}
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
                      setModalOpen(true);
                    }}
                  >
                    <span>+ ajouter une tache</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {modalOpen && (
        <AddTaskPhase
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          setIsAddTaskFinished={setIsRefreshTaskNeeded}
        />
      )}
      {modalUpdateOpen && (
        <UpdateTask
          modalUpdateOpen={modalUpdateOpen}
          setModalUpdateOpen={setModalUpdateOpen}
          task={taskData}
          phaseData={phaseData ? phaseData : null}
          setIsRefreshTaskNeeded={setIsRefreshTaskNeeded}
        />
      )}
    </div>
  );
};

export default PhaseAdvancement;
