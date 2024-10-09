const HistoricProject = () => {
  return (
    <div className="grid place-items-center">
      <h1 className="font-bold  text-zinc-400 text-2xl ">HISTORIQUE</h1>
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white dark:bg-boxdark shadow-lg rounded-lg hidden md:table">
            <thead className="bg-gray-100 border-b border-b-zinc-300 dark:border-b-black text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Modifié par</th>
                <th className="py-3 px-6 text-center">Modifié le</th>
                <th className="py-3 px-6 text-center">Table modifiée</th>
                <th className="py-3 px-6 text-center">caractéristique modifié</th>
                <th className="py-3 px-6 text-center">Ancienne valeur</th>
                <th className="py-3 px-6 text-center">Nouvelle valeur</th>
                <th className="py-3 px-6 text-center">Raison de la modification</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-xs font-light">
              {/* {projectData?.listRessources?.map((ressource) => (
                <tr
                  key={ressource?.id}
                  className="border-b border-zinc-200 hover:bg-zinc-50 dark:hover:bg-black dark:border-black hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {ressource?.ressource}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className="text-gray-700">{ressource?.source}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                            ${
                              ressource?.type === "Disponible"
                                ? "bg-green-100 text-green-500"
                                : "bg-yellow-100 text-yellow-600"
                            } `}
                    >
                      {ressource?.type}
                    </span>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>

          {/* Mobile view */}
          {/* <div className="block md:hidden">
            {projectData?.listRessources?.map((ressource) => (
              <div
                key={ressource?.id}
                className="bg-white *:grid *:grid-cols-2 dark:bg-boxdark shadow-lg rounded-lg mb-4 p-4 border border-zinc-200 dark:border-black"
              >
                <div className="mb-2">
                  <span className="text-emerald-500 font-semibold">
                    Ressource :{" "}
                  </span>
                  <span className="text-gray-800">{ressource?.ressource}</span>
                </div>
                <div className="mb-2">
                  <span className="text-emerald-500 font-semibold">
                    Source :{" "}
                  </span>
                  <span className="text-gray-800">{ressource?.source}</span>
                </div>
                <div>
                  <span className="text-emerald-500 font-semibold">
                    État :{" "}
                  </span>
                  <span
                    className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          ressource?.type === "Disponible"
                            ? "bg-green-100 text-green-500"
                            : "bg-yellow-100 text-yellow-600"
                        }
                        `}
                  >
                    {ressource?.type}
                  </span>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HistoricProject;
