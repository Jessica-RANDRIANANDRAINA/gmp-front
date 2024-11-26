import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { SignalRContext } from "../Activity";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { formatDate } from "../../../../services/Function/DateServices";
import {
  deleteIntercontract,
  deleteTaskActivity,
  deleteTransverse,
  getAllActivitiesOfUser,
} from "../../../../services/Project";
import AddActivity from "../../../../components/Modals/Activity/AddActivity";
import UpdateActivity from "../../../../components/Modals/Activity/UpdateActivity";
import { UserSelectedContext } from "../Activity";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const organizeActivityByStatus = (activities: any[]) => {
  const columns: {
    [key: string]: { id: string; title: string; activityIds: string[] };
  } = {
    "column-1": { id: "column-1", title: "Backlog", activityIds: [] },
    "column-2": { id: "column-2", title: "En cours", activityIds: [] },
    "column-3": { id: "column-3", title: "Traité", activityIds: [] },
    "column-4": { id: "column-4", title: "En pause", activityIds: [] },
    "column-5": { id: "column-5", title: "Abandonné", activityIds: [] },
  };

  const activityMap = activities.reduce((acc, activity) => {
    acc[activity.id] = {
      id: activity.id,
      content: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        status: activity.status,
        startDate: activity.startDate,
        dailyEffort: activity.dailyEffort,
        finished: activity.finished,
        type: activity.type,
        subType: activity.subType,
        projectId: activity.projectid,
        phaseId: activity.phaseid,
        priority: activity.priority,
      },
    };
    const columnKey = Object.keys(columns).find(
      (key) => columns[key].title === activity.status
    );
    if (columnKey) {
      columns[columnKey].activityIds.push(activity.id);
    }
    return acc;
  }, {} as { [key: string]: { id: string; content: { title: string; id: string } } });
  return { activityMap, columns };
};

const AllActivityKanban = () => {
  const { userid } = useParams();
  const { userSelected } = useContext(UserSelectedContext);
  const [data, setData] = useState<any>({
    acivities: {},
    columns: {},
    columnOrder: [],
  });
  const [isModalAddActivityOpen, setIsModalAddActivityOpen] =
    useState<boolean>(false);
  const [isModalUpdateActivityOpen, setIsModalUpdateActivityOpen] =
    useState<boolean>(false);
  // const [connection, setConnection] = useState<HubConnection | null>(null);
  const connection = useContext(SignalRContext);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<any>();
  const deletePopUp = useRef<any>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  // close delete pop up when click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!deletePopUp.current) return;
      if (!deletePopUp || deletePopUp.current.contains(target)) return;
      setActiveActivityId("");
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const fetchData = async () => {
    try {
      var response;
      if (userSelected !== "") {
        response = await getAllActivitiesOfUser(userSelected);
      } else {
        if (userid) {
          response = await getAllActivitiesOfUser(userid);
        }
      }

      const { activityMap, columns } = organizeActivityByStatus(response);
      setData({
        acivities: activityMap,
        columns,
        columnOrder: [
          "column-1",
          "column-2",
          "column-3",
          "column-4",
          "column-5",
        ],
      });
    } catch (error) {
      console.error(`Error at fetch task data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
    setIsRefreshNeeded(false);
  }, [connection, isRefreshNeeded, userSelected]);

  // when task deleted refetchData by using signal R
  useEffect(() => {
    if (!connection) return;

    const handleTaskDeleted = () => fetchData();
    const handleIntercontractDeleted = () => fetchData();
    const handleTransverseDeleted = () => fetchData();

    connection.on("ReceiveTaskActivityDeleted", handleTaskDeleted);
    connection.on("ReceiveIntercontractDeleted", handleIntercontractDeleted);
    connection.on("ReceiveTransverseDeleted", handleTransverseDeleted);

    return () => {
      connection.off("ReceiveTaskActivityDeleted", handleTaskDeleted);
      connection.off("ReceiveIntercontractDeleted", handleIntercontractDeleted);
      connection.off("ReceiveTransverseDeleted", handleTransverseDeleted);
    };
  }, [connection, fetchData]);

  const handleOnDragEnd = async (result: DropResult, activitype: string) => {
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
      const newTaskIds = Array.from(startColumn.activityIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        activityIds: newTaskIds,
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
      const startTaskIds = Array.from(startColumn.activityIds);
      startTaskIds.splice(source.index, 1);

      const newStart = {
        ...startColumn,
        activityIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.activityIds);
      endTaskIds.splice(destination.index, 0, draggableId);

      const newEnd = {
        ...endColumn,
        activityIds: endTaskIds,
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
          if (activitype === "Transverse") {
            await connection.invoke(
              "TransverseMoved",
              draggableId,
              startColumn.title,
              endColumn.title
            );
          } else if (activitype === "InterContract") {
            await connection.invoke(
              "IntercontractMoved",
              draggableId,
              startColumn.title,
              endColumn.title
            );
          } else {
            await connection.invoke(
              "TaskActivityMoved",
              draggableId,
              startColumn.title,
              endColumn.title
            );
          }
          fetchData();
        } catch (error) {
          console.error(`Error at calling task moved: ${error}`);
        }
      }
    }
  };

  const handleToogleMenuDelete = (
    activityId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActiveActivityId(activeActivityId === activityId ? null : activityId);
  };

  const handleDeleteActivity = async (activityId: string, type: string) => {
    try {
      if (type === "Transverse") {
        await deleteTransverse(activityId);
        if (connection) {
          try {
            await connection.invoke("TransverseDeleted", activityId);
          } catch (error) {
            console.error(
              `Error while sending event TransverseDeleted : ${error}`
            );
          }
        }
      } else if (type === "InterContract") {
        await deleteIntercontract(activityId);
        if (connection) {
          try {
            await connection.invoke("IntercontractDeleted", activityId);
          } catch (error) {
            console.error(
              `Error while sending event IntercontractDeleted : ${error}`
            );
          }
        }
      } else {
        await deleteTaskActivity(activityId);
        if (connection) {
          try {
            await connection.invoke("TaskActivityDeleted", activityId);
          } catch (error) {
            console.error(
              `Error while sending event TaskActivityDeleted : ${error}`
            );
          }
        }
      }
      notyf.success("Activité supprimée");
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer.");
      console.error(`Error at handle delete activity: ${error}`);
    }
  };

  return (
    <div className={`p-5`}>
      <DragDropContext
        onDragEnd={(result) => {
          const draggableId = result.draggableId;
          const activitype = data?.acivities?.[draggableId]?.content?.type;
          handleOnDragEnd(result, activitype);
        }}
      >
        <div style={{ display: "flex" }}>
          {data?.columnOrder?.map((columnId: string) => {
            const column = data?.columns[columnId];
            const acivities = column?.activityIds?.map(
              (activityIds: string | number) => data?.acivities[activityIds]
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
                      {acivities?.map((activity: any, index: any) => (
                        <Draggable
                          key={activity.id}
                          draggableId={activity.id}
                          index={index}
                        >
                          {(provided, snapshot) => {
                            const endDate = formatDate(
                              activity.content.startDate
                            );
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
                                  setActivityData(activity);
                                  setIsModalUpdateActivityOpen(true);
                                }}
                              >
                                <div
                                  className="absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer"
                                  onClick={(e) => {
                                    handleToogleMenuDelete(activity.id, e);
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
                                {activeActivityId === activity.id && (
                                  <div
                                    ref={deletePopUp}
                                    className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteActivity(
                                          activity.id,
                                          activity.content.type
                                        );
                                      }}
                                      className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                                    >
                                      Supprimer
                                    </button>
                                  </div>
                                )}
                                {/* pop up menu delete */}

                                <div className="flex flex-col gap-1 dark:text-zinc-400 text-zinc-500">
                                  <div
                                    className={`border rounded w-fit px-1 cursor-pointer mb-2`}
                                  >
                                    {activity.content.type}
                                  </div>
                                  <div className="grid grid-flow-row gap-2 ">
                                    <div className="flex gap-1">
                                      <span
                                        className={`${
                                          activity.content.status === "Traité"
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
                                      <div className="dark:text-whiten text-black">
                                        {activity.content.title}
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <div className="border   rounded-full w-7 h-5 flex justify-center items-center">
                                        {activity.content.dailyEffort}h
                                      </div>
                                      <div
                                        className={`border  rounded-full w-fit px-1 h-5 flex justify-center items-center whitespace-nowrap ${
                                          activity?.content?.subType
                                            ? ""
                                            : "hidden"
                                        }`}
                                      >
                                        {activity.content.subType}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={` pt-1 mt-2 text-xs ${
                                    activity.content.priority === "Moyen" ||
                                    activity.content.priority === "Bas"
                                      ? "hidden "
                                      : "text-orange"
                                  }`}
                                >
                                  {activity.content.priority}
                                </div>
                                <div className="border-t dark:border-t-zinc-600 text-zinc-400  space-y-1 pt-1">
                                  <div className={`text-xs `}>{endDate}</div>
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
                      setIsModalAddActivityOpen(true);
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
      {isModalAddActivityOpen && (
        <AddActivity
          modalOpen={isModalAddActivityOpen}
          setModalOpen={setIsModalAddActivityOpen}
          setIsActivityFinished={setIsRefreshNeeded}
        />
      )}
      {isModalUpdateActivityOpen && (
        <UpdateActivity
          modalUpdateOpen={isModalUpdateActivityOpen}
          setModalUpdateOpen={setIsModalUpdateActivityOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          activity={activityData}
        />
      )}
    </div>
  );
};

export default AllActivityKanban;
