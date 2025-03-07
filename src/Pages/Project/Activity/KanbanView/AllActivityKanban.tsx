import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
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
  deleteTransverse,
  getAllActivitiesOfUser,
  deletetaskProject,
} from "../../../../services/Project";
import AddActivity from "../../../../components/Modals/Activity/AddActivity";
import UpdateActivity from "../../../../components/Modals/Activity/UpdateActivity";
import ListUsers from "../../../../components/UIElements/ListUsers";

import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { IMyHabilitation } from "../../../../types/Habilitation";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const organizeActivityByStatus = (
  activities: any[],
  visibleColumns: string[] = []
) => {
  const allColumns: {
    [key: string]: { id: string; title: string; activityIds: string[] };
  } = {
    "column-1": { id: "column-1", title: "Backlog", activityIds: [] },
    "column-2": { id: "column-2", title: "En cours", activityIds: [] },
    "column-3": { id: "column-3", title: "Traité", activityIds: [] },
    "column-4": { id: "column-4", title: "En pause", activityIds: [] },
    "column-5": { id: "column-5", title: "Abandonné", activityIds: [] },
  };

  const columns =
    visibleColumns.length > 0
      ? Object.fromEntries(
          Object.entries(allColumns).filter(([_, column]) =>
            visibleColumns.includes(column.title)
          )
        )
      : allColumns;

  const activityMap = activities.reduce((acc, activity) => {
    const uniqueKey = `${activity.id}.${activity.userid}`;

    acc[uniqueKey] = {
      id: uniqueKey,
      content: {
        id: uniqueKey,
        title: activity.title,
        description: activity.description,
        status: activity.status,
        startDate: activity.startDate,
        endDate: activity.endDate,
        dailyEffort: activity.dailyEffort ?? 1,
        finished: activity.finished,
        type: activity.type,
        subType: activity.subType,
        projectId: activity.projectid,
        phaseId: activity.phaseid,
        priority: activity.priority,
        userid: activity.userid,
        userName: activity.userName,
        user: [
          {
            user: {
              name: activity.userName,
            },
            userid: activity.userid,
          },
        ],
      },
    };
    const columnKey = Object.keys(columns).find(
      (key) => columns[key].title === activity.status
    );
    if (columnKey) {
      columns[columnKey].activityIds.push(uniqueKey);
    }
    return acc;
  }, {} as { [key: string]: { id: string; content: { title: string; id: string } } });
  const columnOrder = Object.keys(columns);
  return { activityMap, columns, columnOrder };
};

const AllActivityKanban = ({
  selectedOptions,
  search,
  setSearchClicked,
  searchClicked,
  colors,
  isAddActivity,
  setIsAddActivity,
  subordinates,
  statusSelectedOptions,
  myHabilitation,
  isSubordinatesFetched,
}: {
  isSubordinatesFetched: boolean;
  selectedOptions: Array<string>;
  search: {
    ids: (string | undefined)[];
    startDate: string | undefined;
    endDate: string | undefined;
  };
  statusSelectedOptions: string[];
  setSearchClicked: React.Dispatch<React.SetStateAction<boolean>>;
  searchClicked: boolean;
  colors: Record<string, string>;
  isAddActivity: boolean;
  setIsAddActivity: React.Dispatch<React.SetStateAction<boolean>>;
  subordinates: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  myHabilitation: IMyHabilitation | undefined;
}) => {
  const { userid } = useParams();
  const [data, setData] = useState<any>({
    acivities: {},
    columns: {},
    columnOrder: [],
  });
  const [isModalAddActivityOpen, setIsModalAddActivityOpen] =
    useState<boolean>(false);
  const [isModalUpdateActivityOpen, setIsModalUpdateActivityOpen] =
    useState<boolean>(false);
  const connection = useContext(SignalRContext);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<any>();
  const deletePopUp = useRef<any>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  // open add activity modal with parent props trigger
  useEffect(() => {
    if (isAddActivity) {
      setIsModalAddActivityOpen(true);
      setIsAddActivity(false);
    }
  }, [isAddActivity]);

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

  // EVERY TIME THE SEARCH BUTTON IS CLICKED, fetch data
  useEffect(() => {
    if (searchClicked) {
      fetchData();
    }
    setSearchClicked(false);
  }, [searchClicked]);

  const fetchData = useCallback(async () => {
    if (!userid || !isSubordinatesFetched) {
      return;
    }
    try {
      var response;
      var Ids: (string | undefined)[] = [];
      const subordinatesId = subordinates?.map((sub) => sub?.id);
      
      if (search?.ids.length === 1) {
        if (!search?.ids?.[0]) {
          Ids = subordinatesId;
        } else {
          Ids = search?.ids;
        }
      } else if (search?.ids.length > 100) {
        Ids = subordinatesId;
      } else {
        Ids = search?.ids;
      }

      // if (userid && Ids.length > 0) {
      if (userid) {
        response = await getAllActivitiesOfUser(
          search?.startDate,
          search?.endDate,
          selectedOptions,
          Ids.length > 0 ? Ids : subordinatesId
        );

        const { activityMap, columns, columnOrder } = organizeActivityByStatus(
          response,
          statusSelectedOptions
        );

        setData({
          acivities: activityMap,
          columns,
          columnOrder,
        });
      }
    } catch (error) {
      console.error(`Error at fetch task data: ${error}`);
    }
  }, [
    userid,
    search,
    selectedOptions,
    statusSelectedOptions,
    subordinates,
    isSubordinatesFetched,
  ]);

  useEffect(() => {
    if (isSubordinatesFetched) {
      fetchData();
      setIsRefreshNeeded(false);
    }
  }, [
    connection,
    isRefreshNeeded,
    subordinates,
    search,
    isSubordinatesFetched,
  ]);

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
      const newTaskIds = Array.from(startColumn.activityIds) as string[];
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const aboveTaskIdWithUser: string | null =
        destination.index > 0
          ? (newTaskIds[destination.index - 1] as string)
          : null;
      const belowTaskIdWithUser: string | null =
        destination.index < newTaskIds.length - 1
          ? (newTaskIds[destination.index + 1] as string)
          : null;

      const aboveTaskId = aboveTaskIdWithUser?.split(".")?.[0];
      const belowTaskId = belowTaskIdWithUser?.split(".")?.[0];

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
      if (connection) {
        try {
          const taskDraggedId = draggableId?.split(".")?.[0];
          if (activitype === "Transverse") {
            await connection.invoke(
              "TransverseMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
            );
          } else if (activitype === "InterContract") {
            await connection.invoke(
              "IntercontractMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
            );
          } else {
            await connection.invoke(
              "TaskActivityMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
            );
          }
          fetchData();
        } catch (error) {
          console.error(`Error at calling task moved: ${error}`);
        }
      }
    } else {
      // Moving between columns
      const startTaskIds = Array.from(startColumn.activityIds) as string[];
      const endTaskIds = Array.from(endColumn.activityIds) as string[];

      startTaskIds.splice(source.index, 1);
      endTaskIds.splice(destination.index, 0, draggableId);

      const aboveTaskIdWithUser: string | null =
        destination.index > 0
          ? (endTaskIds[destination.index - 1] as string)
          : null;
      const belowTaskIdWithUser: string | null =
        destination.index < endTaskIds.length - 1
          ? (endTaskIds[destination.index + 1] as string)
          : null;

      const aboveTaskId = aboveTaskIdWithUser?.split(".")?.[0];
      const belowTaskId = belowTaskIdWithUser?.split(".")?.[0];

      const newStart = {
        ...startColumn,
        activityIds: startTaskIds,
      };
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
          const taskDraggedId = draggableId?.split(".")?.[0];
          if (activitype === "Transverse") {
            await connection.invoke(
              "TransverseMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
            );
          } else if (activitype === "InterContract") {
            await connection.invoke(
              "IntercontractMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
            );
          } else {
            await connection.invoke(
              "TaskActivityMoved",
              taskDraggedId,
              startColumn.title,
              endColumn.title,
              aboveTaskId,
              belowTaskId
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

  const handleDeleteActivity = async (
    activityIdWithUser: string,
    type: string
  ) => {
    try {
      const activityId = activityIdWithUser?.split(".")?.[0];
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
        await deletetaskProject(activityId);
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
    <div className={``}>
      <DragDropContext
        onDragEnd={(result) => {
          const draggableId = result.draggableId;
          const activitype = data?.acivities?.[draggableId]?.content?.type;
          handleOnDragEnd(result, activitype);
        }}
      >
        <div className="flex p-5 overflow-x-auto">
          {data?.columnOrder?.map((columnId: string) => {
            const column = data?.columns[columnId];
            const acivities = column?.activityIds?.map(
              (activityIds: string | number) => data?.acivities[activityIds]
            );

            return (
              <div className="w-full min-w-[240px]" key={column.id}>
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className="m-2 rounded-md w-full p-2 "
                      {...provided.droppableProps}
                    >
                      <h3 className="mb-3 text-sm">{column.title}</h3>
                      {columnId === "column-1" && (
                        <div
                          className="border text-sm mb-4 p-1 cursor-pointer dark:border-2 shadow-1  shadow-slate-400   text-primaryGreen border-slate-300 hover:bg-slate-100 dark:bg-strokedark dark:border-formStrokedark dark:hover:bg-boxdark2 flex justify-center "
                          onClick={() => {
                            setIsModalAddActivityOpen(true);
                          }}
                        >
                          <span>+ Ajouter une activité</span>
                        </div>
                      )}

                      {/* add scrollable container */}
                      <div className="relative overflow-y-auto h-[70vh]  space-y-2 pr-2">
                        {acivities?.map((activity: any, index: any) => {
                          return (
                            <>
                              <Draggable
                                key={`${activity.content.id}-${activity?.content?.userid}`}
                                draggableId={activity.content.id}
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
                                      className={`p-4 mb-1 relative border border-gray-2 dark:border-2 dark:border-strokedark shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500 text-xs rounded-md  ${
                                        snapshot.isDragging
                                          ? "bg-green-50 dark:bg-emerald-100"
                                          : "bg-white dark:bg-boxdark"
                                      }`}
                                      style={{
                                        ...provided.draggableProps.style,
                                        boxShadow: colors[
                                          activity.content.userid
                                        ]
                                          ? `0px 2px 8px 1px ${
                                              colors[activity.content.userid]
                                            }`
                                          : "0px 2px 8px 1px rgba(0,0,0,0.1)",
                                        borderColor: colors[
                                          activity.content.userid
                                        ]
                                          ? colors[activity.content.userid]
                                          : "",
                                      }}
                                      onClick={() => {
                                        setActivityData(activity);
                                        setIsModalUpdateActivityOpen(true);
                                      }}
                                    >
                                      <div
                                        className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                                          (activity.content.type ===
                                            "Transverse" &&
                                            !myHabilitation?.transverse
                                              .delete) ||
                                          (activity.content.type ===
                                            "InterContract" &&
                                            !myHabilitation?.intercontract
                                              .delete)
                                            ? "hidden"
                                            : ""
                                        }`}
                                        onClick={(e) => {
                                          handleToogleMenuDelete(
                                            activity.id,
                                            e
                                          );
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
                                          className={`absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md `}
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
                                      <div className="space-y-2">
                                        <div className="flex flex-col dark:text-zinc-400 gap-1 text-zinc-500">
                                          <div className="grid grid-cols-2">
                                            <div className="flex gap-1 ">
                                              <div
                                                className={`border rounded w-fit px-1 cursor-pointer mb-2 ${
                                                  activity.content.type ===
                                                  "Projet"
                                                    ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                                    : activity?.content.type ===
                                                      "Transverse"
                                                    ? "bg-purple-100 text-purple-600 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
                                                    : "bg-red-100 text-red-600 border-red-300  dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                                }`}
                                              >
                                                {activity.content.type}
                                              </div>
                                              <div className="border   rounded-md p-1 max-w-7 h-4.5  flex justify-center items-center">
                                                {activity.content.dailyEffort}h
                                              </div>
                                            </div>
                                            <div
                                              className={` text-xs ${
                                                activity.content.priority ===
                                                  "Moyen" ||
                                                activity.content.priority ===
                                                  "Bas"
                                                  ? "hidden "
                                                  : "text-orange"
                                              }`}
                                            >
                                              {activity.content.priority}
                                            </div>
                                          </div>

                                          <div className="grid grid-flow-row gap-2  ">
                                            <div className="flex gap-1">
                                              {/* pince for task traité */}
                                              <span
                                                className={`${
                                                  activity.content.status ===
                                                  "Traité"
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
                                              {/* pince for task traité */}
                                              {/* pince for task en pause */}
                                              <span
                                                className={`${
                                                  activity.content.status ===
                                                  "En pause"
                                                    ? ""
                                                    : "hidden"
                                                }`}
                                              >
                                                <svg
                                                  width="17"
                                                  height="17"
                                                  viewBox="0 0 24 24"
                                                  className="fill-orange"
                                                >
                                                  <g id="SVGRepo_iconCarrier">
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="10"
                                                      className="stroke-orange-500"
                                                      strokeWidth="1.5"
                                                    ></circle>
                                                    <rect
                                                      x="9"
                                                      y="8"
                                                      width="2"
                                                      height="8"
                                                      className="fill-white"
                                                      rx="1"
                                                    ></rect>
                                                    <rect
                                                      x="13"
                                                      y="8"
                                                      width="2"
                                                      height="8"
                                                      className="fill-white"
                                                      rx="1"
                                                    ></rect>
                                                  </g>
                                                </svg>
                                              </span>
                                              {/* pince for task en pause */}
                                              {/* pince for task en abandonnée */}
                                              <span
                                                className={`${
                                                  activity.content.status ===
                                                  "Abandonné"
                                                    ? ""
                                                    : "hidden"
                                                }`}
                                              >
                                                <svg
                                                  width="17"
                                                  height="17"
                                                  viewBox="0 0 24 24"
                                                  className="fill-red-500"
                                                >
                                                  <g id="SVGRepo_iconCarrier">
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="10"
                                                      className="stroke-red-500"
                                                      strokeWidth="1.5"
                                                    ></circle>
                                                    <path
                                                      d="M8 8L16 16M16 8L8 16"
                                                      className="stroke-white"
                                                      strokeWidth="2.5"
                                                      strokeLinecap="round"
                                                    ></path>
                                                  </g>
                                                </svg>
                                              </span>
                                              {/* pince for task en abandonnée */}
                                              {/* pince for task en cours */}
                                              <span
                                                className={`${
                                                  activity.content.status ===
                                                  "En cours"
                                                    ? ""
                                                    : "hidden"
                                                }`}
                                              >
                                                <svg
                                                  width="17"
                                                  height="17"
                                                  viewBox="0 0 24 24"
                                                  className="fill-blue-400"
                                                >
                                                  <g id="SVGRepo_iconCarrier">
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="10"
                                                      className="stroke-blue-400"
                                                      strokeWidth="1.5"
                                                    ></circle>
                                                    <path
                                                      d="M12 8V12L14.5 14.5"
                                                      className="stroke-white"
                                                      strokeWidth="2.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    ></path>
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="0.8"
                                                      className="fill-white"
                                                    ></circle>
                                                  </g>
                                                </svg>
                                              </span>
                                              {/* pince for task en cours */}
                                              {/* pince for task en backlog */}
                                              <span
                                                className={`${
                                                  activity.content.status ===
                                                  "Backlog"
                                                    ? ""
                                                    : "hidden"
                                                }`}
                                              >
                                                <svg
                                                  width="17"
                                                  height="17"
                                                  viewBox="0 0 24 24"
                                                  className="fill-blue-300"
                                                >
                                                  <g id="SVGRepo_iconCarrier">
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="10"
                                                      className="stroke-blue-300"
                                                      strokeWidth="1.5"
                                                      strokeDasharray="3 2"
                                                      fill="none"
                                                    ></circle>
                                                  </g>
                                                </svg>
                                              </span>
                                              {/* pince for task en backlog */}
                                              <div className="dark:text-whiten text-black">
                                                {activity.content.title}
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap">
                                              <div
                                                className={`border  rounded-md  p-1 text-justify flex justify-center items-center  ${
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

                                        <div className="border-t flex items-center justify-between dark:border-t-zinc-600 text-zinc-400 pt-1">
                                          <div className={`text-xs `}>
                                            {endDate}
                                          </div>
                                          <div
                                            className={`${
                                              activity?.content?.user?.[0]?.user
                                                ?.name
                                                ? ""
                                                : "hidden"
                                            }`}
                                          >
                                            <ListUsers
                                              data={
                                                activity?.content?.user ?? []
                                              }
                                              type="all"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            </>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
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
          myHabilitation={myHabilitation}
        />
      )}
      {isModalUpdateActivityOpen && (
        <UpdateActivity
          modalUpdateOpen={isModalUpdateActivityOpen}
          setModalUpdateOpen={setIsModalUpdateActivityOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          activity={activityData}
          myHabilitation={myHabilitation}
        />
      )}
    </div>
  );
};

export default AllActivityKanban;
