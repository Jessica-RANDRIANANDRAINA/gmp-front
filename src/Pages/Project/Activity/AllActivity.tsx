import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { formatDate } from "../../../services/Function/DateServices";
import { getAllActivitiesOfUser } from "../../../services/Project";
import AddActivity from "../../../components/Modals/Activity/AddActivity";

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
        dailyEffort: activity.dailyEffort,
        finished: activity.finished,
        type: activity.type,
        subType: activity.subType,
        projectTitle: activity.projectTitle,
        phaseTitle: activity.phaseTitle,
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

const AllActivity = () => {
  const { userid } = useParams();
  const [data, setData] = useState<any>({
    acivities: {},
    columns: {},
    columnOrder: [],
  });
  const [isModalAddActivityOpen, setIsModalAddActivityOpen] =
    useState<boolean>(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const fetchData = async () => {
    try {
      if (userid) {
        const response = await getAllActivitiesOfUser(userid);
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
      }
    } catch (error) {
      console.error(`Error at fetch task data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          await connection.invoke(
            "TaskMoved",
            draggableId,
            startColumn.title,
            endColumn.title
          );
          // fetchData();
        } catch (error) {
          console.error(`Error at calling task moved: ${error}`);
        }
      }
    }
  };
  return (
    <div className={`p-5`}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
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
                              activity.content.dueDate
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
                              >
                                <div className="absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer">
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
                                  {activity.content.title}
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
                      setIsModalAddActivityOpen(true);
                    }}
                  >
                    <span>+ ajouter une tâche</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
      {
        isModalAddActivityOpen && (
          <AddActivity
            modalOpen={isModalAddActivityOpen}
            setModalOpen={setIsModalAddActivityOpen}
            // setIsActivityFinished={}
          />
        )
      }
    </div>
  );
};

export default AllActivity;
