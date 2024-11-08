import { useState, useEffect, createContext } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import ProjectLayout from "../../../layout/ProjectLayout";
import { NavLink, Outlet } from "react-router-dom";
import Breadcrumb from "../../../components/BreadCrumbs/BreadCrumb";
import { IDecodedToken } from "../../../types/user";
import { decodeToken } from "../../../services/Function/TokenService";

export const SignalRContext = createContext<HubConnection | null>(null);

const Activity = () => {
  const [decodedToken, setDecodedToken] = useState<IDecodedToken>();
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("_au_pr");
    if (token) {
      try {
        const decoded = decodeToken("pr");
        setDecodedToken(decoded);
      } catch (error) {
        console.error(`Invalid token ${error}`);
      }
    }

    // create and start connection to signalR
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_ENDPOINT}/activityHub`)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => setConnection(newConnection))
      .catch((error) =>
        console.error("Connection activity hub failed: ", error)
      );

    // clean connection
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);
  return (
    <SignalRContext.Provider value={connection}>
      <ProjectLayout>
        <div>
          <div className="bg-white dark:bg-boxdark pt-4 pb-3 px-9 shadow-sm">
            <Breadcrumb pageName="Mes Activités" />
            <div className="flex w-full justify-between flex-wrap">
              <div className="flex gap-4 *:p-3 *:rounded-md *:mt-5 text-xs font-semibold overflow-x-scroll hide-scrollbar mb-2 whitespace-nowrap">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 bg-green-50 dark:bg-green-100"
                      : "hover:text-green-700 text-slate-600"
                  }
                  to={`/gmp/activity/${decodedToken?.jti}/list`}
                >
                  Tous
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 bg-green-50 dark:bg-green-100"
                      : "hover:text-green-700 text-slate-600"
                  }
                  to={`/gmp/activity/${decodedToken?.jti}/task`}
                >
                  Projets
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 bg-green-50 dark:bg-green-100"
                      : "hover:text-green-700 text-slate-600"
                  }
                  to={`/gmp/activity/${decodedToken?.jti}/transverse`}
                >
                  Transverses
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-700 bg-green-50 dark:bg-green-100"
                      : "hover:text-green-700 text-slate-600"
                  }
                  to={`/gmp/activity/${decodedToken?.jti}/intercontract`}
                >
                  Intercontracts
                </NavLink>
              </div>
            </div>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </ProjectLayout>
    </SignalRContext.Provider>
  );
};

export default Activity;
