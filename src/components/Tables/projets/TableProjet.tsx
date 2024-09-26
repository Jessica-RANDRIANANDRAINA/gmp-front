import { useEffect, useState } from "react";
import { CustomInput, CustomSelect } from "../../UIElements";
import { formatDate } from "../../../services/Function/DateServices";
import { decodeToken } from "../../../services/Function/TokenService";
import Pagination from "../Pagination";
import ListUsers from "../../UIElements/ListUsers";

const TableProjet = ({
  data,
  setProjectToModif,
  setIdProjectForDetails,
}: {
  data: Array<any>;
  setProjectToModif: Function;
  setIdProjectForDetails: Function;
}) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);
  const userConnected = decodeToken("pr");

  // TO GET THE NUMBER OF PAGE DEPENDING OF THE ENTRIES PER PAGE
  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };

  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };

  // GET THE NUMBER OF PAGES EACH TIME A ENTRIES PER PAGE OR THE FILTEREDDATA CHANGE
  useEffect(() => {
    setPageNumbers(getPageNumber(data.length));
  }, [entriesPerPage, data.length]);

  const handleSelectAllProject = () => {
    if (projectSelected.length < data.length) {
      setProjectSelected([]);
      data.map((p) => setProjectSelected((prev) => [...prev, p.id]));
      setIsAllSelected(true);
    } else {
      setProjectSelected([]);
      setIsAllSelected(false);
    }
  };

  return (
    <div className="bg-white min-h-[80vh] pt-2 shadow-1 rounded-lg border border-zinc-200 dark:border-strokedark dark:bg-boxdark">
      {/* ===== FILTER START ===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
          <CustomInput
            type="text"
            // value={"search.nameAndMail"}
            label="Recherche"
            placeholder="Titre"
            rounded="medium"
            onChange={(e) => {
              //   setSearch({
              //     ...search,
              //     nameAndMail: e.target.value,
              //   });
              console.log(e);
            }}
          />
          <CustomInput
            type="text"
            // value={"search.nameAndMail"}
            label="Recherche"
            placeholder="Nom ou mail"
            rounded="medium"
            onChange={(e) => {
              //   setSearch({
              //     ...search,
              //     nameAndMail: e.target.value,
              //   });
              console.log(e);
            }}
          />
          <CustomInput
            type="text"
            // value={"search.nameAndMail"}
            label="Recherche"
            placeholder="Nom ou mail"
            rounded="medium"
            onChange={(e) => {
              //   setSearch({
              //     ...search,
              //     nameAndMail: e.target.value,
              //   });
              console.log(e);
            }}
          />
          <div className="flex items-end pb-3 mx-2">
            <button
              //   onClick={handleDeleteFilter}
              className="flex justify-center gap-1 h-fit text-sm font-medium"
            >
              Effacer les filtres
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#00AE5D"
              >
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* ===== FILTER END ===== */}
      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 items-center flex justify-between px-3 transition-opacity ${
          isAllSelected ? "opacity-0" : "opacity-100"
        }`}
      >
        <button
          disabled={actualPage === 1}
          className="rotate-180"
          onClick={() => setActualPage((prev) => Math.max(prev - 1, 1))}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === 1 ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="text-xl  text-title font-medium">
          Listes de tous les projets
        </div>
        <button
          disabled={actualPage === pageNumbers}
          onClick={() =>
            setActualPage((prev) => Math.min(prev + 1, pageNumbers))
          }
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12H18M18 12L13 7M18 12L13 17"
              className={` ${
                actualPage === pageNumbers ? "stroke-slate-400" : "stroke-black"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* =====PAGINATE AND TITLE END===== */}
      {/* ===== BULK START ===== */}
      <div
        className={` mt-[-60px] border-primaryGreen border  bg-white z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          projectSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div> {projectSelected.length} éléments séléctionné </div>
        <div>
          <CustomSelect
            data={
              projectSelected.length > 1
                ? ["supprimer"]
                : ["Modifier", "Supprimer"]
            }
            className="mb-2  "
            placeholder="Actions"
            onValueChange={(e) => {
              if (e.includes("Modifier")) {
                setProjectToModif(projectSelected);
              } else {
                console.log("first");
              }
            }}
          />
        </div>
      </div>
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full mb-4 overflow-x-auto ">
        <table className="w-full text-sm table-auto">
          {/* ===== TABLE HEAD START ===== */}
          <thead className="pt-5  rounded-t-xl bg-primaryGreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className="pl-2">
                <button
                  onClick={handleSelectAllProject}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      projectSelected.length === data.length
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Titre</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Priorité</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Role</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <span>Equipes</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Date début</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Date de fin</span>
                </div>
              </th>
              <th className="py-4 px-4  font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    className={`
                     transform transition-transform duration-200`}
                  >
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Avancement</span>
                </div>
              </th>
            </tr>
          </thead>
          {/* ===== TABLE HEAD END ===== */}
          {/* ===== TABLE BODY END ===== */}
          <tbody>
            {data
              ?.filter((_project, index) => indexInPaginationRange(index))
              .map((project) => {
                const dateStart = formatDate(project?.startDate);
                const dateEnd = formatDate(project?.endDate);
                const userDetails = project.listUsers?.filter(
                  (user: { userid: string | undefined }) => {
                    return user?.userid === userConnected?.jti;
                  }
                );

                return (
                  <tr
                    key={project?.id}
                    className="hover:bg-whiten dark:hover:bg-whitenGreen"
                  >
                    <td className="pl-2">
                      <button
                        className="cursor-pointer border w-5 h-5"
                        onClick={() => {
                          setProjectSelected((prev) => {
                            if (prev?.includes(project.id)) {
                              return prev.filter((id) => id !== project.id);
                            } else {
                              return [...prev, project.id];
                            }
                          });
                        }}
                      >
                        <svg
                          width="18"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${
                            projectSelected.includes(project.id)
                              ? "visible"
                              : "invisible"
                          }`}
                        >
                          <path
                            d="M4 12.6111L8.92308 17.5L20 6.5"
                            stroke="#000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p
                        className="text-black dark:text-white font-bold cursor-pointer"
                        onClick={() => {
                          setIdProjectForDetails(project.id);
                        }}
                      >
                        {project?.title}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p
                        className={` dark:text-white font-semibold rounded-md  text-center py-1 px-2 text-xs  w-fit
                          ${
                            project?.priority === "Moyenne"
                              ? "bg-yellow-200  text-amber-600"
                              : project?.priority === "Faible"
                              ? "bg-cyan-100 text-cyan-700"
                              : project?.priority === "Elevée"
                              ? "bg-red-200 text-red-600"
                              : ""
                          }
                          `}
                      >
                        {project?.priority}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {userDetails?.[0]?.role}
                      </p>
                    </td>
                    <td className="border-b  gap-1 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <ListUsers data={project?.listUsers} />
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">{dateStart}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">{dateEnd}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <p className="text-black dark:text-white">
                        {project?.completionPercentage}%
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
          {/* ===== TABLE BODY END ===== */}
        </table>
      </div>
      {/* =====PAGINATE START===== */}
      <div className="flex flex-col flex-wrap md:flex-row justify-end px-4 items-center">
        <div>
          <CustomSelect
            label="Par page: "
            data={["5", "10", "15", "20"]}
            placeholder="5"
            className="flex"
            value={entriesPerPage.toString()}
            onValueChange={(selectedValue) => {
              setEntriesPerPage(parseInt(selectedValue, 10));
            }}
          />
        </div>
        <Pagination
          actualPage={actualPage}
          setActualPage={setActualPage}
          pageNumbers={pageNumbers}
        />
      </div>
      {/* =====PAGINATE END===== */}
      {/* =====TABLE END===== */}
    </div>
  );
};

export default TableProjet;
