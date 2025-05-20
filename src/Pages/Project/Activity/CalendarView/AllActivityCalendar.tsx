import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import frLocale from "@fullcalendar/core/locales/fr";
import {
  deleteIntercontract,
  deletetaskProject,
  deleteTransverse,
  getAllActivitiesOfUser,
} from "../../../../services/Project";
import { SignalRContext } from "../Activity";
import AddActivity from "../../../../components/Modals/Activity/AddActivity";
import UpdateActivity from "../../../../components/Modals/Activity/UpdateActivity";
import DuplicateActivity from "../../../../components/Modals/Activity/DuplicateActivity";
import CollapsibleSection from "../../../../components/UIElements/CollapsibleSection";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { IMyHabilitation } from "../../../../types/Habilitation";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

// interface Activity {
//   id: string;
//   content: {
//     id: string;
//     title: string;
//     description: string;
//     status: string;
//     startDate: string;
//     dueDate: string;
//     dailyEffort: number;
//     finished: boolean;
//     type: string;
//     subType: string;
//     projectId: string;
//     phaseId: string;
//     priority: string;
//     userid: string;
//     userName: string;
//     user: Array<{
//       user: { name: string };
//       userid: string;
//     }>;
//   };
// }

const AllActivityCalendar = ({
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
  statusSelectedOptions: Array<string>;
  search: any;
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
  const connection = useContext(SignalRContext);
  const deletePopUp = useRef<any>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);
  const [isModalDuplicateActivityOpen, setIsModalDuplicateActivityOpen] = useState<boolean>(false);
  // const [activityData, setActivityData] = useState<any>();
  //   const [isModalAddActivityOpen, setIsModalAddActivityOpen] =
  //     useState<boolean>(false);
  const [isRefreshNeeded, setIsRefreshNeeded] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<any>({
  content: {
    id: "",
    title: "",
    description: "",
    status: "",
    startDate: "",
    dueDate: "",
    endDate: "",
    fichier: "",
    dailyEffort: 1,
    type: "",
    subType: "",
    projectId: "",
    phaseId: "",
    priority: "",
    userid: "",
    userName: "",
    user: []
  }
});
  // const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [data, setData] = useState<any>();

  // useEffect(() => {
  //   fetchData();
  // }, []);

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
          // Ids = [decodedToken?.jti];
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
          Ids.length > 0 ? Ids : subordinatesId
        );

        const filteredResponse = response.filter(
          (activity: { status: string }) =>
            statusSelectedOptions.includes(activity.status)
        );

        setData(filteredResponse);

        // Grouper les tâches par userid et par date
        const groupedByUserAndDate = filteredResponse.reduce(
          (acc: any, task: any) => {
            const userid = task.userid;
            let startDate = new Date(task.startDate);
            const localStartDate = new Date(
              startDate.getTime() - startDate.getTimezoneOffset() * 60000
            ); // Convertir en fuseau horaire local
            const dateKey = localStartDate.toISOString().split("T")[0]; // Utiliser la date locale comme clé

            if (!acc[userid]) {
              acc[userid] = {};
            }
            if (!acc[userid][dateKey]) {
              acc[userid][dateKey] = [];
            }

            acc[userid][dateKey].push(task);
            return acc;
          },
          {}
        );

        // Convertir l'objet groupé en un tableau d'événements pour le calendrier
        const calendarEvents = Object.keys(groupedByUserAndDate).flatMap(
          (userid) =>
            Object.keys(groupedByUserAndDate[userid]).flatMap((date) => {
              const tasks = groupedByUserAndDate[userid][date];

              // Trier les tâches par heure de début
              tasks.sort(
                (
                  a: { startDate: string | number | Date },
                  b: { startDate: string | number | Date }
                ) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              );

              let previousTaskEnd: string | number | Date | null = null; // Garder une trace de l'heure de fin de la tâche précédente

              return tasks.map(
                (task: {
                  dailyEffort: number;
                  startDate: string | number | Date;
                  id: string;
                  userid: string;
                  title: string;
                  endDate: Date | string;
                  dueDate: Date | string;
                  description: string;
                  status: string;
                  type: string;
                  subType: string;
                  phaseid: string;
                  projectid: string;
                  userName: string;
                }) => {
                  const dailyEffort = task.dailyEffort || 1;

                  // Définir l'heure de début
                  let startDate = new Date(task.startDate);
                  startDate = new Date(
                    startDate.getTime() - startDate.getTimezoneOffset() * 60000
                  ); // Convertir en fuseau horaire local

                  if (previousTaskEnd) {
                    startDate = new Date(previousTaskEnd); // Commencer après la fin de la tâche précédente
                  }

                  // Définir l'heure de fin
                  const endDate = new Date(startDate);
                  endDate.setHours(startDate.getHours() + dailyEffort);

                  // Mettre à jour l'heure de fin pour la tâche suivante
                  previousTaskEnd = endDate;

                  return {
                    id: `${task.id}.${task.userid}`,
                    title: task.title,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    dueDate: task.endDate,
                    description: task.description,
                    status: task.status,
                    type: task.type,
                    subType: task.subType,
                    dailyEffort: task.dailyEffort,
                    phaseid: task.phaseid,
                    projectid: task.projectid,
                    user: task.userid,
                    userList: [
                      {
                        user: {
                          name: task.userName,
                        },
                        userid: task.userid,
                      },
                    ],
                  };
                }
              );
            })
        );

        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error(`Error fetching TASK ACTIVITY data: ${error}`);
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
  }, [connection, isRefreshNeeded, isSubordinatesFetched]);

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
     const userList = task.userList || [];
    const data = {
      content: {
        dailyEffort: task?.dailyEffort,
        description: task?.description,
        id: task?.id?.split(".")?.[0],
        startDate: task?.start,
        endDate: task.end,
        dueDate: task.end,
        status: task?.status,
        title: task?.title,
        type: task?.type,
        phaseId: task?.phaseid,
        projectId: task?.projectid,
        priority: task?.priority,
        subType: task?.subType,
        userName: userList[0]?.user?.name || task.userName || "",
      user: userList.map((user: any) => ({
        userid: user.userid,
        user: {
          name: user.user?.name || "",
          email: user.user?.email || ""
        }
      }))
      },
    };
    setTaskData(data);
    setIsModalUpdateOpen(true);
  };

 const handleModifClick = (task: any) => {
  // Normalisation des données utilisateur
  const normalizeUsers = () => {
    if (Array.isArray(task.userList)) {
      return task.userList.map((user: any) => ({
        userid: user.userid,
        user: {
          name: user.user?.name || "",
          email: user.user?.email || ""
        }
      }));
    }
    
    if (Array.isArray(task.user)) {
      return task.user.map((user: any) => ({
        userid: user.userid,
        user: {
          name: user.user?.name || "",
          email: user.user?.email || ""
        }
      }));
    }

    // Cas par défaut si aucun tableau utilisateur trouvé
    return [{
      userid: task.userid || "",
      user: {
        name: task.userName || "",
        email: ""
      }
    }];
  };

  // Normalisation des dates
  const startDate = task.startDate || task.start;
  const dueDate = task.dueDate || task.endDate;

  // Construction de l'objet activité normalisé
  const activityData = {
    content: {
      id: task.id?.split('.')?.[0] || "",
      title: task.title || "",
      description: task.description || "",
      status: task.status || "Backlog",
      startDate: startDate ? new Date(startDate).toISOString() : "",
      endDate: dueDate ? new Date(dueDate).toISOString() : "",
      dailyEffort: task.dailyEffort || 1,
      type: task.type || "",
      subType: task.subType || "",
      projectId: task.projectid || task.projectId || "",
      phaseId: task.phaseid || task.phaseId || "",
      priority: task.priority || "Medium",
      userid: task.userid || "",
      userName: task.userName || "",
      user: normalizeUsers()
    }
  };

  console.log("Données pour modification:", activityData);
  setTaskData(activityData);
  setIsModalUpdateOpen(true);
};
  //duplicateActivity
const handleDuplicateClick = (task: any) => {
  // 1. Formatage des utilisateurs
  const formatUser = (userData: any) => ({
    userid: userData.userid || "",
    projectid: task.extendedProps?.projectid || task.projectid || "",
    role: "collaborator",
    user: {
      name: userData.user?.name || userData.name || "",
      email: userData.user?.email || userData.email || ""
    }
  });

  // 2. Récupération des utilisateurs
  let userList: any[] = [];
  
  if (Array.isArray(task.extendedProps?.userList)) {
    userList = task.extendedProps.userList.map(formatUser);
  } else if (Array.isArray(task.userList)) {
    userList = task.userList.map(formatUser);
  } else if (task.extendedProps?.user || task.userid) {
    userList = [{
      userid: task.extendedProps?.user || task.userid || "",
      projectid: task.extendedProps?.projectid || task.projectid || "",
      role: "collaborator",
      user: {
        name: task.extendedProps?.userName || task.userName || "",
        email: ""
      }
    }];
  }

  // 3. Gestion des dates corrigée
  const startDate = task.startDate ? new Date(task.startDate).toISOString() : "";
  const dueDate = task.extendedProps?.dueDate || task.dueDate || "";

  // 4. Construction finale avec toutes les corrections
  const activityData = {
    content: {
      id: task.id?.split('.')?.[0] || "",
      title: task.title || "",
      description: task.extendedProps?.description || task.description || "",
      status: task.extendedProps?.status || task.status || "Backlog",
      startDate,
      dueDate, // Utilisation cohérente de dueDate partout
      fichier: task.extendedProps?.fichier || task.fichier || "",
      dailyEffort: task.extendedProps?.dailyEffort || task.dailyEffort || 1,
      type: task.extendedProps?.type || task.type || "",
      subType: task.extendedProps?.subType || task.subType || "",
      projectId: task.extendedProps?.projectid || task.projectid || "",
      phaseId: task.extendedProps?.phaseid || task.phaseid || "",
      priority: task.extendedProps?.priority || task.priority || "Medium",
      userid: userList[0]?.userid || task.extendedProps?.user || task.userid || "",
      userName: userList[0]?.user?.name || 
               task.extendedProps?.userList?.[0]?.user?.name || 
               task.userName || 
               "",
      user: userList,
    }
  };

  console.log("data modification :", activityData);
  setTaskData(activityData);
  setIsModalDuplicateActivityOpen(true);
};
  
  //end duplicateActivity
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
  const [activityId] = activityIdWithUser.split(".");
  try {
    if (type === "Transverse") {
      await deleteTransverse(activityId);
      if (connection) {
        try {
          await connection.invoke("TransverseDeleted", activityId);
        } catch (error) {
          console.error(`Error while sending event TransverseDeleted : ${error}`);
        }
      }
    } else if (type === "InterContract") {
      await deleteIntercontract(activityId);
      if (connection) {
        try {
          await connection.invoke("IntercontractDeleted", activityId);
        } catch (error) {
          console.error(`Error while sending event IntercontractDeleted : ${error}`);
        }
      }
    } else {
      // Utilisez deletetaskProject pour les projets comme dans AllActivityKanban
      await deletetaskProject(activityId);
      if (connection) {
        try {
          await connection.invoke("TaskActivityDeleted", activityId);
        } catch (error) {
          console.error(`Error while sending event TaskActivityDeleted : ${error}`);
        }
      }
    }
    notyf.success("Activité supprimée");
  } catch (error) {
    notyf.error("Une erreur s'est produite, veuillez réessayer.");
    console.error(`Error at handle delete activity: ${error}`);
  }
};

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  // const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const handleDropdownToggle = (e: React.MouseEvent<HTMLElement>, taskId: string) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === taskId ? null : taskId);
  };
  return (
    <div className="p-5 flex flex-col-reverse md:grid md:grid-cols-5">
      {/* card */}
      <div className="md:col-span-4">
        <FullCalendar
          timeZone="UTC"
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            listPlugin,
            timeGridPlugin,
          ]}
          initialView={window.innerWidth < 768 ? "timeGridDay" : "dayGridMonth"}
          events={events}
          eventClick={handleEventClick}
          eventClassNames={(eventInfo) => {
            if (eventInfo.event.extendedProps.type === "Projet") {
              return "!bg-green-100 !border-green-300  !text-green-800 dark:!bg-green-900 dark:!border-green-700 dark:!text-green-300"; // Couleurs pour Projet
            } else if (eventInfo.event.extendedProps.type === "Transverse") {
              return "!bg-purple-100 !border-purple-300  !text-purple-800 dark:!bg-purple-900 dark:!border-purple-700 dark:!text-purple-300"; // Couleurs pour Transverse
            } else {
              return "!bg-red-100 !border-red-300  !text-red-800 dark:!bg-red-900 dark:!border-red-700 dark:!text-red-300"; // Couleurs par défaut
            }
          }}
          headerToolbar={{
            left: window.innerWidth < 768 ? "prev,next" : "prev,next today",
            center: "title",
            right:
              window.innerWidth < 768
                ? "timeGridDay"
                : "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          noEventsText="Pas d'activité prévues pour cette période"
          locale={frLocale}
          height={"70vh"}
          eventContent={(arg) => {
            const { title, extendedProps, id } = arg.event;

            const dailyEffort = extendedProps?.dailyEffort ?? 1;
            const dropdownId = `${id}.${extendedProps?.userid}`;

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
                className={` relative  min-h-full max-h-full flex flex-col items-center justify-center whitespace-nowrap border dark:border-2 border-transparent font-light w-full p-1 text-black dark:text-whiten cursor-pointer text-xs relative group`}
              >
               
                {/* debut */}
                
 
                 
                    <div
                      className="absolute top-1 right-2 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // éviter la propagation de l'événement
                        handleDropdownToggle(e, dropdownId);
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
                    
                    {openDropdownId === dropdownId && ( // Changed 'activity' to 'task'
                        <div className="absolute z-20 right-0 top-5 bg-white dark:bg-boxdark shadow-lg rounded-md w-20">
                          <button
                           onClick={() => {
                            const taskForDuplicate = {
                              id: arg.event.id,
                              title: arg.event.title,
                              startDate: arg.event.start?.toISOString(),
                              endDate: arg.event.end?.toISOString(),
                              ...arg.event.extendedProps,
                            };
                          
                            handleDuplicateClick(taskForDuplicate);
                            setOpenDropdownId(null);
                            setActiveTaskId("");
                          }}
                            className="block w-full text-left px-2 py-1 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          >
                            Dupliquer
                          </button>
                        </div>
                      )}
                {/* fin */}
                <div>
                  <b className="overflow-x-clip whitespace-nowrap">
                    {dailyEffort}h -{" "}
                    {title.length > 15 ? `${title.slice(0, 15)}...` : title}
                  </b>
                  <div className="absolute tooltip bottom-full left-0 dark:bg-whiten dark:text-black bg-black text-white text-xs rounded p-1 hidden group-hover:block  whitespace-nowrap ">
                    {title}
                  </div>
                </div>
                <div
                  className={`border  flex justify-center items-center p-1 rounded-full 
                    
                    ${
                      extendedProps.type === "Projet"
                        ? "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                        : extendedProps?.type === "Transverse"
                        ? "bg-purple-100 text-purple-600 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
                        : "bg-red-100 text-red-600 border-red-300  dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                    } 
                  
                  `}
                >
                  {extendedProps?.type === "Projet"
                    ? "P"
                    : extendedProps?.type === "Transverse"
                    ? "T"
                    : "I"}
                  {/* <ListUsers data={extendedProps?.userList ?? []} type="all" /> */}
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
      {/* fin card */}
      <div className="md:col-span-1 md:pt-16">
        <div
          className="border ml-4 p-1 cursor-pointer border-slate-300 hover:bg-slate-100 dark:hover:bg-boxdark2 flex justify-center text-xs"
          onClick={() => {
            setIsModalAddOpen(true);
          }}
        >
          <span>+ Ajouter une activité</span>
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
                    key={`${task?.id}-${task?.userid}`}
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
                  >
                    <div
                      className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                        (task.type === "Transverse" &&
                          !myHabilitation?.transverse.delete) ||
                        (task.type === "InterContract" &&
                          !myHabilitation?.intercontract?.delete)
                          ? "hidden"
                          : ""
                      }`}
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
                      className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                        (task.type === "Transverse" &&
                          !myHabilitation?.transverse.delete) ||
                        (task.type === "InterContract" &&
                          !myHabilitation?.intercontract?.delete)
                          ? "hidden"
                          : ""
                      }`}
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
                    key={task.id}
                  >
                    <div
                      className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                        (task.type === "Transverse" &&
                          !myHabilitation?.transverse.delete) ||
                        (task.type === "InterContract" &&
                          !myHabilitation?.intercontract?.delete)
                          ? "hidden"
                          : ""
                      }`}
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
                    key={`${task?.id}-${task?.userid}`}
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
                  >
                    <div
                      className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                        (task.type === "Transverse" &&
                          !myHabilitation?.transverse.delete) ||
                        (task.type === "InterContract" &&
                          !myHabilitation?.intercontract?.delete)
                          ? "hidden"
                          : ""
                      }`}
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
                    key={`${task?.id}-${task?.userid}`}
                    onClick={() => {
                      handleModifClick(task);
                    }}
                    className="relative cursor-pointer p-4 bg-white dark:bg-boxdark rounded shadow-2 hover:shadow-md hover:shadow-slate-300 dark:hover:shadow-slate-500"
                  >
                    <div
                      className={`absolute top-2 right-1 hover:bg-zinc-100 dark:hover:bg-boxdark2 px-1 h-4 cursor-pointer ${
                        (task.type === "Transverse" &&
                          !myHabilitation?.transverse.delete) ||
                        (task.type === "InterContract" &&
                          !myHabilitation?.intercontract?.delete)
                          ? "hidden"
                          : ""
                      }`}
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
          myHabilitation={myHabilitation}
        />
      )}
      {isModalUpdateOpen && (
        <UpdateActivity
          modalUpdateOpen={isModalUpdateOpen}
          setModalUpdateOpen={setIsModalUpdateOpen}
          setIsRefreshNeeded={setIsRefreshNeeded}
          activity={taskData}
          myHabilitation={myHabilitation}
        />
      )}
    {isModalDuplicateActivityOpen && taskData && (
  <DuplicateActivity
    modalDuplicateOpen={isModalDuplicateActivityOpen}
    setModalDuplicateOpen={setIsModalDuplicateActivityOpen}
    setIsRefreshNeeded={setIsRefreshNeeded}
    activity={taskData}
    myHabilitation={myHabilitation}
  />
)}
    </div>
  );
};

export default AllActivityCalendar;