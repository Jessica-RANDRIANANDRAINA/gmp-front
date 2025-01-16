import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHistoricByProjectId } from "../../../../services/Project";
import { IAudit } from "../../../../types/Audit";
import { formatDate } from "../../../../services/Function/DateServices";
import { SyncLoader } from "react-spinners";

const HistoricProject = () => {
  const { projectId } = useParams();
  const [historicData, setHistoricData] = useState<Array<IAudit>>([]);

  const fetchHistoricData = async () => {
    if (projectId) {
      const data = await getHistoricByProjectId(projectId);
      setHistoricData(data);
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, []);

  return (
    <div className=" ">
      <h1 className="font-bold  text-center  text-zinc-400 text-2xl ">
        HISTORIQUE
      </h1>
      <div
        className={`flex justify-center items-center min-h-[30vh] ${
          historicData ? "hidden" : ""
        }`}
      >
        <SyncLoader size={18} className="mr-2" color={"teal"} />
      </div>
      <div className={`justify-center ${historicData ? "flex" : "hidden"}`}>
        <div className="overflow-x-auto">
          <table className="overflow-x-auto table-auto bg-white dark:bg-boxdark shadow-lg rounded-lg hidden md:table">
            <thead className="bg-gray-100 border-b border-b-zinc-300 dark:border-b-black text-gray-600 uppercase text-sm leading-normal">
              <tr className="*:whitespace-nowrap">
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Modifié par</th>
                <th className="py-3 px-6 text-center">Modifié le</th>
                <th className="py-3 px-6 text-center">Table modifiée</th>
                <th className="py-3 px-6 text-center">Rubrique</th>
                <th className="py-3 px-6 text-center">Ancienne valeur</th>
                <th className="py-3 px-6 text-center">Nouvelle valeur</th>
                <th className="py-3 px-6 text-center">
                  Raison de la modification
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-xs font-light">
              {historicData?.map((historic) => {
                const modifiedAd = formatDate(historic?.modifiedAt, true);
                var oldValueTime = "";
                var newValueTime = "";
                if (historic?.oldValue.includes("00.0000000")) {
                  oldValueTime = formatDate(historic.oldValue, false);
                }
                if (historic?.newValue.includes("00.0000000")) {
                  newValueTime = formatDate(historic.newValue, false);
                }

                return (
                  <tr
                    key={historic?.id}
                    className="border-b border-zinc-200 hover:bg-zinc-50 dark:hover:bg-black dark:border-black hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`font-medium border p-1 text-center rounded-full ${
                            historic?.modificationType === "update"
                              ? "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700 "
                              : historic?.modificationType === "delete"
                              ? "bg-red-100 text-red-600 border-red-300  dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                              : "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                          }`}
                        >
                          {historic?.modificationType === "update"
                            ? "Modification"
                            : historic?.modificationType === "delete"
                            ? "Suppression"
                            : "Création"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">
                        {historic?.modifiedBy}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">{modifiedAd}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">{historic?.table}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">
                        {historic?.column === "Role"
                          ? "Utilisateur"
                          : historic.column}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center ">
                      <span className="text-gray-700">
                        {historic?.oldValue.includes("00.0000000")
                          ? oldValueTime
                          : historic?.oldValue === ""
                          ? "vide"
                          : historic?.oldValue}

                        {historic?.column === "Avancement" ? "%" : ""}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">
                        {historic?.newValue.includes("00.0000000")
                          ? newValueTime
                          : historic?.newValue}
                        {historic?.column === "Avancement" ? "%" : ""}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-gray-700">{historic?.reason}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile view */}
          <div className="block md:hidden">
            {historicData?.map((historic) => {
              const modifiedAt = formatDate(historic?.modifiedAt, true);
              var oldValueTime = "";
              var newValueTime = "";
              if (historic?.oldValue.includes("00.0000000")) {
                oldValueTime = formatDate(historic.oldValue, false);
              }
              if (historic?.newValue.includes("00.0000000")) {
                newValueTime = formatDate(historic.newValue, false);
              }
              return (
                <div
                  key={historic?.id}
                  className="*:grid *:grid-cols-2 overflow-x-auto bg-white  dark:bg-boxdark shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black"
                >
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Type :{" "}
                    </span>
                    <span
                      className={`font-medium text-center border p-1 rounded-full ${
                        historic?.modificationType === "update"
                          ? "bg-amber-100 text-amber-600 border-amber-300  dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700  "
                          : historic?.modificationType === "delete"
                          ? "bg-red-100 text-red-600 border-red-300  dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                          : "bg-green-100 text-green-600 border-green-300  dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                      }`}
                    >
                      {historic?.modificationType === "update"
                        ? "Modification"
                        : historic?.modificationType === "delete"
                        ? "Suppression"
                        : "Création"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-500 font-semibold">
                      Modifié par :{" "}
                    </span>
                    <span className="text-gray-800">
                      {historic?.modifiedBy}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Modifié le :{" "}
                    </span>
                    <span className="text-gray-800">{modifiedAt}</span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Table modifiée :{" "}
                    </span>
                    <span className="text-gray-800">{historic?.table}</span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Rubrique :{" "}
                    </span>
                    <span className="text-gray-800">{historic?.column}</span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Ancienne valeur :{" "}
                    </span>
                    <span className="text-gray-800">
                      {historic?.oldValue.includes("00.0000000")
                        ? oldValueTime
                        : historic?.oldValue === ""
                        ? "vide"
                        : historic?.oldValue}

                      {historic?.column === "Avancement" ? "%" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Nouvelle valeur :{" "}
                    </span>
                    <span className="text-gray-800">
                      {historic?.newValue.includes("00.0000000")
                        ? newValueTime
                        : historic?.newValue}
                      {historic?.column === "Avancement" ? "%" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-500 font-semibold">
                      Raison de la modification :{" "}
                    </span>
                    <span className="text-gray-800">{historic?.reason}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricProject;
