import { useState, useEffect } from "react";
import { TableAccessProps } from "../../types/table";
import { CustomSelect, CustomInput } from "../UIElements";

const TableAccess = ({ data }: TableAccessProps) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [accessSelected, setAccessSelected] = useState<string[]>([]);
  const [dataSorted, setDataSorted] = useState({
    label: true,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [search, setSearch] = useState({
    name: "",
  });

  const filteredData = data.filter((item) => {
    const lowerCaseSearchName = search.name.toLowerCase();

    return item.label.toLowerCase().includes(lowerCaseSearchName);
  });

  const getPageNumber = (dataLength: number) => {
    return Math.ceil(dataLength / entriesPerPage);
  };
  const indexInPaginationRange = (index: number) => {
    let end = actualPage * entriesPerPage;
    let start = end - entriesPerPage;
    return index >= start && index < end;
  };
  useEffect(() => {
    setPageNumbers(getPageNumber(filteredData.length));
  }, [entriesPerPage, filteredData.length]);

  useEffect(() => {
    setActualPage(1);
    setAccessSelected([]);
    setIsAllSelected(false);
  }, [search]);

  const handleDeleteFilter = () => {
    setSearch({
      ...search,
      name: "",
    });
  };

  const handleSelectAllAccess = () => {
    if (accessSelected.length < filteredData.length) {
      setAccessSelected([]);
      filteredData.map((u) => setAccessSelected((prev) => [...prev, u.id]));
      setIsAllSelected(true);
    } else {
      setAccessSelected([]);
      setIsAllSelected(false);
    }
  };
  return (
    <div className="bg-white pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="flex m-5 flex-wrap justify-between items-center"> */}

      {/* =====FILTER START===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
          <CustomInput
            type="text"
            value={search.name}
            label="Recherche"
            placeholder="Label"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                name: e.target.value,
              });
            }}
          />

          <div className="flex items-end pb-3 mx-2">
            <button
              onClick={handleDeleteFilter}
              className="flex justify-center gap-1 h-fit"
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
      {/* =====FILTER END===== */}
      {/* </div> */}
      {/* =====PAGINATE AND TITLE START===== */}
      <div
        className={`pb-4 flex justify-between px-3 transition-opacity ${
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
        <div className="text-2xl text-title font-medium">
          Listes de tous les accès
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
      {/* ===== BULK ACTION START ===== */}
      <div
        className={` mt-[-60px] border-primaryGreen border  bg-white z-40 relative px-2 flex items-center justify-between transition-transform duration-200 ease-in-out transform ${
          accessSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div> {accessSelected.length} éléments séléctionné </div>
        <div>
          <CustomSelect
            data={["Modifier", "Supprimer"]}
            className="mb-2"
            placeholder="Actions"
            onValueChange={() => {
              console.log("first");
            }}
          />
        </div>
      </div>
      {/* ===== BULK ACTION END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className=" pl-2 ">
                <button
                  onClick={handleSelectAllAccess}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      accessSelected.length === filteredData.length
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
                    ></path>{" "}
                  </svg>
                </button>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center ">
                  <button
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        label: !dataSorted.label,
                      });
                    }}
                    className={`${
                      dataSorted.label ? "" : "rotate-180"
                    } transform transition-transform duration-200   `}
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
                      ></path>
                    </svg>
                  </button>
                  <span>Label</span>
                </div>
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Admin
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Projet
              </th>
              <th className="py-4 px-4 max-w-40  font-bold  text-white dark:text-white xl:pl-11">
                Transverse
              </th>
              <th className="py-4 px-4 max-w-40  font-bold  text-white dark:text-white xl:pl-11">
                Inter-contrat
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              ?.filter((_access, index) => indexInPaginationRange(index))
              .filter((access) => {
                const label = access?.label?.toLowerCase();

                const searchQuery = search.name.toLowerCase();

                return label.includes(searchQuery);
              })
              .map((access) => (
                <tr
                  key={access?.id}
                  className="hover:bg-whiten dark:hover:bg-whitenGreen"
                >
                  <td className="pl-2 ">
                    <button
                      className="cursor-pointer border w-5 h-5"
                      onClick={() => {
                        setAccessSelected((prev) => {
                          if (prev?.includes(access.id)) {
                            return prev.filter((id) => id !== access.id);
                          } else {
                            return [...prev, access.id];
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
                          accessSelected.includes(access.id)
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
                        ></path>{" "}
                      </svg>
                    </button>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">
                      {access?.label}
                    </p>
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.admin?.length > 1 ? (
                      <details>
                        <summary>{access?.admin?.[0]}</summary>
                        {access?.admin?.length > 1 && (
                          <p className="text-black dark:text-white">
                            {access?.admin?.slice(1).join(", ")}{" "}
                          </p>
                        )}
                      </details>
                    ) : access?.admin?.length === 0 ? (
                      <p>--</p>
                    ) : (
                      <p className="text-black dark:text-white">
                        {access?.admin}
                      </p>
                    )}
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.project?.length > 1 ? (
                      <details>
                        <summary>{access?.project?.[0]}</summary>
                        {access?.project?.length > 1 && (
                          <p className="text-black dark:text-white">
                            {access?.project?.slice(1).join(", ")}{" "}
                          </p>
                        )}
                      </details>
                    ) : access?.project?.length === 0 ? (
                      <p>--</p>
                    ) : (
                      <p className="text-black dark:text-white">
                        {access?.project}
                      </p>
                    )}
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.transverse?.length > 1 ? (
                      <details>
                        <summary>{access?.transverse?.[0]}</summary>
                        {access?.transverse?.length > 1 && (
                          <p className="text-black dark:text-white">
                            {access?.transverse?.slice(1).join(", ")}{" "}
                          </p>
                        )}
                      </details>
                    ) : access?.transverse?.length === 0 ? (
                      <p>--</p>
                    ) : (
                      <p className="text-black dark:text-white">
                        {access?.transverse}
                      </p>
                    )}
                  </td>

                  <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {access?.intercontract?.length > 1 ? (
                      <details>
                        <summary>{access?.intercontract?.[0]}</summary>
                        {access?.intercontract?.length > 1 && (
                          <p className="text-black dark:text-white">
                            {access?.intercontract?.slice(1).join(", ")}{" "}
                          </p>
                        )}
                      </details>
                    ) : access?.intercontract?.length === 0 ? (
                      <p>--</p>
                    ) : (
                      <p className="text-black dark:text-white">
                        {access?.intercontract}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* =====TABLE END===== */}
    </div>
  );
};

export default TableAccess;
