import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import {
  deleteIntercontract,
  deleteTaskActivity,
  deleteTransverse,
  getAllActivitiesOfUser,
} from "../../../../services/Project";
import { SignalRContext } from "../Activity";
import AddActivity from "../../../../components/Modals/Activity/AddActivity";
import UpdateActivity from "../../../../components/Modals/Activity/UpdateActivity";
import CollapsibleSection from "../../../../components/UIElements/CollapsibleSection";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { IDecodedToken } from "../../../../types/user";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AllActivityCalendar = ({
  selectedOptions,
  search,
  setSearchClicked,
  searchClicked,
  colors,
  decodedToken,
  isAddActivity,
  setIsAddActivity,
}: {
  selectedOptions: Array<string>;
  search: any;
  setSearchClicked: React.Dispatch<React.SetStateAction<boolean>>;
  searchClicked: boolean;
  colors: Record<string, string>;
  decodedToken: IDecodedToken | undefined;
  isAddActivity: boolean;
  setIsAddActivity: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [events, setEvents] = useState<any[]>([]);
  const connection = useContext(SignalRContext);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<any>();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [data, setData] = useState<any>();
  const deletePopUp = useRef<any>(null);

  // open add activity modal with parent props trigger
  useEffect(() => {
    if (isAddActivity) {
      setIsModalAddOpen(true);
      setIsAddActivity(false);
    }
  }, [isAddActivity]);

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

  // EVERY TIME THE SEARCH BUTTON IS CLICKED, fetch data
  useEffect(() => {
    if (searchClicked) {
      fetchData();
    }
    setSearchClicked(false);
  }, [searchClicked]);

  const fetchData = async () => {
    try {
      var response;
      var Ids: (string | undefined)[] = [];
      if (search?.ids.length === 1) {
        if (!search?.ids?.[0]) {
          Ids = [decodedToken?.jti];
        } else {
          Ids = search?.ids;
        }
      } else {
        Ids = search?.ids;
      }
      if (userid) {
        response = await getAllActivitiesOfUser(
          search?.startDate,
          search?.endDate,
          selectedOptions,
          Ids
        );
      }

      setData(response);

      // const startOdDay = new Date(search?.startDate || new Date());
      // startOdDay.setHours(0, 0, 0, 0);

      // const endOfDay = new Date(startOdDay);
      // endOfDay.setHours(23, 59, 59, 999);

      const calendarEvents = response.reduce(
        (acc: any[], intercontract: any, index: number) => {
          const dailyEffort = intercontract.dailyEffort || 1;

          // Utiliser la date de début initiale si fournie
          let startDate = new Date(
            intercontract?.startDate || search?.startDate || new Date()
          );
          startDate.setHours(0, 0, 0, 0); // Début de la journée pour l'alignement initial

          if (index > 0) {
            const previousTaskEnd = new Date(acc[index - 1].end);
            if (previousTaskEnd.toDateString() === startDate.toDateString()) {
              startDate = previousTaskEnd; // La tâche commence après la précédente si elles sont dans le même jour
            }
          }

          // Calcul de la fin de la tâche
          const endDate = new Date(startDate);
          let calculatedEndHour = startDate.getHours() + dailyEffort;

          if (calculatedEndHour > 24) {
            // Si la tâche dépasse 24h, la garder dans le même jour et ajuster les heures
            startDate.setHours(24 - dailyEffort, 0, 0, 0);
            calculatedEndHour = 24;
          }

          endDate.setHours(calculatedEndHour, 0, 0, 0);

          // Ajout de l'événement
          acc.push({
            id: `${intercontract.id}.${intercontract?.userid}`,
            title: intercontract.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            description: intercontract.description,
            status: intercontract.status,
            type: intercontract.type,
            dailyEffort: intercontract.dailyEffort,
            phaseid: intercontract?.phaseid,
            projectid: intercontract?.projectid,
            user: intercontract?.userid,
          });

          return acc;
          // return {
          //   id: `${intercontract.id}.${intercontract?.userid}`,
          //   title: intercontract.title,
          //   start: startDate.toISOString(),
          //   end: endDate.toISOString(),
          //   description: intercontract.description,
          //   status: intercontract.status,
          //   type: intercontract.type,
          //   dailyEffort: intercontract.dailyEffort,
          //   phaseid: intercontract?.phaseid,
          //   projectid: intercontract?.projectid,
          //   user: intercontract?.userid,
          // };
        },
        []
      );

      setEvents(calendarEvents);
    } catch (error) {
      console.error(`Error fetching TASK ACTIVITY data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
    setIsRefreshNeeded(false);
  }, [connection, isRefreshNeeded]);

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

  const handleEventClick = (info: any) => {
    const task = events.find((event) => event.id === info.event.id);

    const data = {
      content: {
        dailyEffort: task?.dailyEffort,
        description: task?.description,
        id: task?.id?.split(".")?.[0],
        startDate: task?.start,
        status: task?.status,
        title: task?.title,
        type: task?.type,
        phaseId: task?.phaseid,
        projectId: task?.projectid,
      },
    };
    setTaskData(data);
    setIsModalUpdateOpen(true);
  };

  const handleModifClick = (task: any) => {
    const data = {
      content: {
        dailyEffort: task?.dailyEffort,
        description: task?.description,
        id: task?.id,
        startDate: task?.start,
        status: task?.status,
        title: task?.title,
        type: task?.type,
        phaseId: task?.phaseid,
        projectId: task?.projectid,
      },
    };
    setTaskData(data);
    setIsModalUpdateOpen(true);
  };

  const handleToogleMenuDelete = (
    activityId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActiveTaskId(activeTaskId === activityId ? null : activityId);
  };

  const handleDeleteActivity = async (
    activityIdWithUser: string,
    type: string
  ) => {
    const [activityId, userId] = activityIdWithUser.split(".");
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
    <div className="p-5 flex flex-col-reverse md:grid md:grid-cols-5">
      <div className="md:col-span-4">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            listPlugin,
            timeGridPlugin,
          ]}
          initialView={
            window.innerWidth < 768 ? "timeGridWeek" : "dayGridMonth"
          }
          events={events}
          eventClick={handleEventClick}
          eventClassNames={(eventInfo) => {
            if (eventInfo.event.extendedProps.type === "Projet") {
              return "!bg-green-100 !border-green-300 !text-green-800 dark:!bg-green-900 dark:!border-green-700 dark:!text-green-300"; // Couleurs pour Projet
            } else if (eventInfo.event.extendedProps.type === "Transverse") {
              return "!bg-purple-100 !border-purple-300 !text-purple-800 dark:!bg-purple-900 dark:!border-purple-700 dark:!text-purple-300"; // Couleurs pour Transverse
            } else {
              return "!bg-red-100 !border-red-300 !text-red-800 dark:!bg-red-900 dark:!border-red-700 dark:!text-red-300"; // Couleurs par défaut
            }
          }}
          headerToolbar={{
            left: window.innerWidth < 768 ? "prev,next" : "prev,next today",
            center: "title",
            right:
              window.innerWidth < 768
                ? "timeGridWeek,timeGridDay"
                : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          noEventsText="Pas d'activité prévues pour cette période"
          locale={frLocale}
          height={"70vh"}
          eventContent={(arg) => {
            const { title, extendedProps } = arg.event;

            const dailyEffort = extendedProps?.dailyEffort;

            return (
              <div
                style={{
                  boxShadow: colors[extendedProps?.user]
                    ? `0px 1px 8px 1px ${colors[extendedProps?.user]}`
                    : "0px 1px 8px 1px rgba(0,0,0,0.1)",
                  borderColor: colors[extendedProps?.user]
                    ? colors[extendedProps?.user]
                    : "",
                }}
                className={`z-99 grid grid-flow-col place-content-between border dark:border-2 border-transparent font-light w-full p-1 text-black dark:text-whiten cursor-pointer text-xs relative group`}
              >
                <div>
                  <b>
                    {dailyEffort}h -{" "}
                    {title.length > 15 ? `${title.slice(0, 15)}...` : title}
                  </b>
                  <div className="absolute z-999999 bottom-full left-0 mt-1 dark:bg-whiten dark:text-black bg-black text-white text-xs rounded p-1 hidden group-hover:block  whitespace-nowrap ">
                    {title}
                  </div>
                </div>
                <div
                  className={`border w-4 flex justify-center items-center p-1 rounded-full ${
                    extendedProps.type === "Projet"
                      ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                      : extendedProps?.type === "Transverse"
                      ? "bg-purple-100 text-purple-600 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
                      : "bg-red-100 text-red-600 border-red-300  dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                  }`}
                >
                  {extendedProps?.type === "Projet"
                    ? "P"
                    : extendedProps?.type === "Transverse"
                    ? "T"
                    : "I"}
                </div>
              </div>
            );
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",

            timeGridWeek: window.innerWidth < 768 ? "S" : "Semaine",
            timeGridDay: window.innerWidth < 768 ? "J" : "Jour",
          }}
          dayHeaderClassNames="text-xs sm:text-sm md:text-base"
        />
      </div>
      <div className="md:col-span-1 md:pt-16">
        <div
          className="border ml-4 p-1 cursor-pointer border-slate-300 hover:bg-slate-100 dark:hover:bg-boxdark2 flex justify-center text-xs"
          onClick={() => {
            setIsModalAddOpen(true);
          }}
        >
          <span>+ ajouter une activité</span>
        </div>
        <div className="">
          <CollapsibleSection title="Backlog">
            <div className="space-y-2 text-xs">
              {data
                ?.filter(
                  (task: { status: string }) => task.status === "Backlog"
                )
                ?.map((task: any) => (
                  <div
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
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
                            handleDeleteActivity(task.id, task.type);
                          }}
                          className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    {/* pop up menu delete */}
                    {task?.title}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="En cours">
            <div className="space-y-2 text-xs">
              {data
                ?.filter(
                  (task: { status: string }) => task.status === "En cours"
                )
                ?.map((task: any) => (
                  <div
                    key={`${task.id}.${task?.userid}`}
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
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
                            handleDeleteActivity(task.id, task.type);
                          }}
                          className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    {/* pop up menu delete */}
                    {task?.title}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Traité">
            <div className="space-y-2 text-xs">
              {data
                ?.filter((task: { status: string }) => task.status === "Traité")
                ?.map((task: any) => (
                  <div
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
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
                            handleDeleteActivity(task.id, task.type);
                          }}
                          className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    {/* pop up menu delete */}
                    {task?.title}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="En pause">
            <div className="space-y-2 text-xs">
              {data
                ?.filter(
                  (task: { status: string }) => task.status === "En pause"
                )
                ?.map((task: any) => (
                  <div
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
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
                            handleDeleteActivity(task.id, task.type);
                          }}
                          className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    {/* pop up menu delete */}
                    {task?.title}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Abandonné">
            <div className="space-y-2 text-xs">
              {data
                ?.filter(
                  (task: { status: string }) => task.status === "Abandonné"
                )
                ?.map((task: any) => (
                  <div
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
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
                            handleDeleteActivity(task.id, task.type);
                          }}
                          className="text-red-600 dark:text-red-400 dark:hover:bg-red-950  hover:bg-red-50 px-4 py-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                    {/* pop up menu delete */}
                    {task?.title}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
        </div>
      </div>

      {/* Modal pour ajouter et mettre à jour les intercontracts */}
      {isModalAddOpen && (
        <AddActivity
          modalOpen={isModalAddOpen}
          setModalOpen={setIsModalAddOpen}
          setIsActivityFinished={setIsRefreshNeeded}
        />
      )}
      {isModalUpdateOpen && (
        <UpdateActivity
          modalUpdateOpen={isModalUpdateOpen}
          setModalUpdateOpen={setIsModalUpdateOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          activity={taskData}
        />
      )}
    </div>
  );
};

export default AllActivityCalendar;
