import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import ProjectLayout from "../../layout/ProjectLayout";
import { useCallback, useEffect, useState } from "react";
import { getAllMyNotification, updateNotifRead } from "../../services/Project";
import { INotification, IListNotification } from "../../types/Notification";
import {
  formatDate,
  formatDateToText,
} from "../../services/Function/DateServices"; // Assurez-vous que cette fonction ne retourne que la date
import { decodeToken } from "../../services/Function/TokenService";
import { IDecodedToken } from "../../types/user";
import { getNotificationMessage } from "../../constants/NotificationMessage";
import Pagination from "../../components/Tables/Pagination";

const AllNotifications = () => {
  const [activityData, setActivityData] = useState<INotification>();
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);

  const getPageNumber = (dataLength: number | undefined) => {
    if (dataLength) {
      return Math.ceil(dataLength / 20);
    } else {
      return 1;
    }
  };

  useEffect(() => {
    const totalNotification = activityData?.totalNotifications;

    setPageNumbers(getPageNumber(totalNotification));
  }, [activityData]);

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
        if (decoded?.jti) {
          fetchNotifications(decoded?.jti);
        }
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }
  }, []);

  const fetchNotifications = async (userid: string) => {
    if (userid) {
      try {
        const notifs = await getAllMyNotification(userid, actualPage, 20);
        setActivityData(notifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  const handleChangeReadStateMessage = useCallback(
    async (userid: string, notifid: string) => {
      try {
        await updateNotifRead(userid, notifid);
        setActivityData((prev) => {
          if (!prev) return prev;
          const notification = prev.listNotification.find(
            (notif) => notif.id === notifid
          );
          if (!notification || notification.isRead) {
            return prev;
          }

          return {
            ...prev,
            listNotification: prev.listNotification.map((notif) =>
              notif.id === notifid ? { ...notif, isRead: true } : notif
            ),
            numberOfNotificationNotRead: Math.max(
              prev.numberOfNotificationNotRead - 1,
              0
            ),
          };
        });
      } catch (error) {
        console.error("Error at update readt state message : ", error);
      }
    },
    []
  );

  // Fonction pour regrouper les notifications par date
  const groupNotificationsByDate = (notifications: IListNotification[]) => {
    const grouped: Record<string, IListNotification[]> = {};

    notifications.forEach((notif) => {
      // Utiliser uniquement la date (en enlevant l'heure) pour regrouper
      const notifDate = formatDate(notif.modifiedAt, false); // Format sans heure : jj/mm/aaaa
      const dateKey = notifDate.split("/").reverse().join("-"); // Transforme en format yyyy-mm-dd

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(notif);
    });

    return grouped;
  };

  // Regrouper les notifications par date
  const groupedNotifications = activityData
    ? groupNotificationsByDate(activityData.listNotification)
    : {};

  return (
    <ProjectLayout>
      <div className="mx-4 p-6 md:mx-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="w-full mb-6 flex justify-between items-center">
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              { name: "Notifications" },
            ]}
          />
        </div>

        {/* Notifications Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedNotifications).map((dateKey) => {
            return (
              <div key={dateKey}>
                {/* Afficher le titre de la journée */}
                <h2 className="text-xl font-semibold dark:text-gray-2 mb-4">
                  {/* {dateKey} */}
                  {formatDateToText(dateKey)}
                </h2>

                {/* Afficher les notifications de cette journée */}
                {groupedNotifications[dateKey].map((notif, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer mb-2 items-center justify-between space-x-4 bg-white dark:bg-formStrokedark p-4 rounded-lg shadow-sm"
                    onClick={() => {
                      if (decodedToken?.jti) {
                        handleChangeReadStateMessage(
                          decodedToken?.jti,
                          notif.id
                        );
                      }
                    }}
                  >
                    {/* Notification Read Status (Déplacer ici si besoin) */}
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          notif.isRead
                            ? "bg-gray-400" // Gris pour "Lu"
                            : "bg-red-500 animate-pulse" // Rouge clignotant pour "Non lu"
                        }`}
                      ></span>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-grow">
                      <div className="text-sm dark:text-gray-3">
                        {getNotificationMessage(
                          notif?.title ?? "",
                          notif?.userRoleInProject as
                            | "director"
                            | "member"
                            | "observator",
                          notif?.projectid ?? "",
                          notif.type as
                            | "Create"
                            | "Update"
                            | "Delete"
                            | "Add"
                            | "Archive"
                            | "Warning",
                          notif.table ?? "",
                          notif.subTable ?? "",
                          notif.oldValue,
                          notif.newValue,
                          notif.activityid ?? "",
                          notif?.modifiedBy
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(notif.modifiedAt, true)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div>
          <Pagination
            actualPage={actualPage}
            setActualPage={setActualPage}
            pageNumbers={pageNumbers}
          />
        </div>
      </div>
    </ProjectLayout>
  );
};

export default AllNotifications;
