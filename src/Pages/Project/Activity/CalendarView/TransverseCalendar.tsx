import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import {
  getTransverseByUserId,
  deleteTransverse,
} from "../../../../services/Project";
import { SignalRContext } from "../Activity";
import { Notyf } from "notyf";
import {
  AddTransverse,
  UpdateTransverse,
} from "../../../../components/Modals/Activity";
import "notyf/notyf.min.css";
import CollapsibleSection from "../../../../components/UIElements/CollapsibleSection";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const TransverseCalendar = () => {
  const { userid } = useParams();
  const [events, setEvents] = useState<any[]>([]);
  const connection = useContext(SignalRContext);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
  const [transverseData, setTransverseData] = useState<any>();
  const [activeTransverseId, setActiveTransverseId] = useState<string | null>(
    null
  );
  const [data, setData] = useState<any>();
  const deletePopUp = useRef<any>(null);

  // close delete pop up when click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!deletePopUp.current) return;
      if (!deletePopUp || deletePopUp.current.contains(target)) return;
      setActiveTransverseId("");
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const fetchData = async () => {
    try {
      if (userid) {
        const response = await getTransverseByUserId(userid);
        setData(response);
        const calendarEvents = response.map((intercontract: any) => {
          const startDate = new Date(intercontract.startDate);
          const endDate = new Date(startDate);
          startDate.setHours(7, 30, 0, 0);
          endDate.setHours(15, 30, 0, 0);

          return {
            id: intercontract.id,
            title: intercontract.title,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            description: intercontract.description,
            status: intercontract.status,
            type: intercontract.type,
            dailyEffort: intercontract.dailyEffort,
          };
        });

        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error(`Error fetching intercontract data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
    setIsRefreshNeeded(false);
  }, [connection, isRefreshNeeded]);

  // when transverse deleted refetchData by using signal R
  useEffect(() => {
    if (connection) {
      connection.on("ReceiveTransverseDeleted", () => {
        fetchData();
      });
    }
    return () => {
      if (connection) {
        connection.off("ReceiveTransverseDeleted");
      }
    };
  }, [connection]);

  const handleEventClick = (info: any) => {
    const transverse = events.find((event) => event.id === info.event.id);
    const data = {
      content: {
        dailyEffort: transverse?.dailyEffort,
        description: transverse?.description,
        id: transverse?.id,
        startDate: transverse?.start,
        status: transverse?.status,
        title: transverse?.title,
        type: transverse?.type,
      },
    };
    setTransverseData(data);
    setIsModalUpdateOpen(true);
  };

  const handleModifClick = (task: any) => {
    const data = {
      content: task,
    };

    setTransverseData(data);
    setIsModalUpdateOpen(true);
  };

  const handleDeleteTransverse = async (transverseId: string) => {
    try {
      await deleteTransverse(transverseId);
      notyf.success("Tâche transverse supprimé");
      if (connection) {
        try {
          await connection.invoke("TransverseDeleted", transverseId);
        } catch (error) {
          console.error(
            `Error while sending event TransverseDeleted : ${error}`
          );
        }
      }
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer.");
      console.error(`Error at handle delete task transverse: ${error}`);
    }
  };

  const handleToogleMenuDelete = (
    transverseId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setActiveTransverseId(
      activeTransverseId === transverseId ? null : transverseId
    );
  };

  return (
    <div className="p-5 flex flex-col-reverse md:grid md:grid-cols-5">
      <div className="md:col-span-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          initialView={window.innerWidth < 768 ? "listWeek" : "dayGridMonth"}
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            left: window.innerWidth < 768 ? "prev,next" : "prev,next today",
            center: "title",
            right:
              window.innerWidth < 768
                ? "listWeek,listDay"
                : "dayGridMonth,listWeek,listDay",
          }}
          noEventsText="Pas d'intercontrat prévues pour cette période"
          locale={frLocale}
          height={"70vh"}
          eventContent={(arg) => {
            const { title, extendedProps } = arg.event;
            const dailyEffort = extendedProps?.dailyEffort; // task duration in hours
            return (
              <div className="flex whitespace-break-spaces cursor-pointer text-xs ">
                <b>
                  {dailyEffort}h - {title}
                </b>
              </div>
            );
          }}
          buttonText={{
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",

            listWeek: window.innerWidth < 768 ? "S" : "Semaine",
            listDay: window.innerWidth < 768 ? "J" : "Jour",
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
          <span>+ ajouter une tâche transverse</span>
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
                    {activeTransverseId === task.id && (
                      <div
                        ref={deletePopUp}
                        className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransverse(task.id);
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
                    {activeTransverseId === task.id && (
                      <div
                        ref={deletePopUp}
                        className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransverse(task.id);
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
                    {activeTransverseId === task.id && (
                      <div
                        ref={deletePopUp}
                        className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransverse(task.id);
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
          <CollapsibleSection title="Stand by">
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
                    {activeTransverseId === task.id && (
                      <div
                        ref={deletePopUp}
                        className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransverse(task.id);
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
                    {activeTransverseId === task.id && (
                      <div
                        ref={deletePopUp}
                        className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark dark:border-formStrokedark border-zinc-100 dark:hover:border-red-950 border shadow-lg rounded-md "
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransverse(task.id);
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
        <AddTransverse
          modalOpen={isModalAddOpen}
          setModalOpen={setIsModalAddOpen}
          setIsAddFinished={setIsRefreshNeeded}
        />
      )}
      {isModalUpdateOpen && (
        <UpdateTransverse
          modalUpdateOpen={isModalUpdateOpen}
          setModalUpdateOpen={setIsModalUpdateOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          transverse={transverseData}
        />
      )}
    </div>
  );
};

export default TransverseCalendar;
