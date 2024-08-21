import { useState, useEffect } from "react";
import { TableAccessProps } from "../../types/table";
import { CustomSelect } from "../UIElements";

const TableAccess = ({ data }: TableAccessProps) => {
  const [dataSorted, setDataSorted] = useState({
    label: true,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);

  return (
    <div className="bg-white pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="w-full  flex justify-end items-center">
          <button className="md:w-fit gap-2 flex w-full cursor-pointer mt-2 py-4 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M12 6V18"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Ajouter un accès
          </button>
        </div>
        {/* =====FILTER START===== */}
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full ">
          here the filters
        </div>
        {/* =====FILTER END===== */}
      </div>
      {/* =====PAGINATE AND TITLE START===== */}
      <div className=" pb-4 flex justify-between px-3 ">
        <div className="rotate-180">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M6 12H18M18 12L13 7M18 12L13 17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </div>
        <div className="text-2xl text-title  font-medium">
          Listes de tous les accès
        </div>
        <div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M6 12H18M18 12L13 7M18 12L13 17"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </div>
      </div>
      {/* =====PAGINATE AND TITLE END===== */}
      {/* ===== BULK ACTION START ===== */}
      <div className="w-full flex border rounded-md p-4 justify-between mb-2 ">
        <p></p>
        <CustomSelect
        className="w-1/2"
          label="Action"
          data={["Modifier", "Supprimer"]}
          onValueChange={() => {
            console.log("bulk");
          }}
        />
      </div>
      {/* ===== BULK ACTION END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className=" pl-2 ">
                <button
                  onClick={() => setIsAllSelected(!isAllSelected)}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${isAllSelected ? "visible" : "invisible"}`}
                  >
                    <path
                      d="M4 12.6111L8.92308 17.5L20 6.5"
                      stroke="#fff"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                  <span>Nom</span>
                </div>
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Visuel
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Management
              </th>
              <th className="py-4 px-4 max-w-40  font-bold  text-white dark:text-white xl:pl-11">
                Département
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((access) => (
              <tr
                key={access?.id}
                className="hover:bg-whiten dark:hover:bg-whitenGreen"
              >
                <td className="pl-2 ">
                  <button
                    className="cursor-pointer border w-5 h-5"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    <svg
                      width="18"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${isAllSelected ? "visible" : "invisible"}`}
                    >
                      <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </svg>
                  </button>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-black dark:text-white">{access?.label}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-black dark:text-white">{access?.visuel}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-black dark:text-white">
                    {access?.management}
                  </p>
                </td>
                <td className="border-b max-w-40 border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  {access?.department?.length > 1 ? (
                    <details>
                      <summary>{access?.department?.[0]}</summary>
                      {access?.department?.length > 1 && (
                        <p className="text-black dark:text-white">
                          {access?.department?.slice(1).join(", ")}{" "}
                        </p>
                      )}
                    </details>
                  ) : access?.department?.length === 0 ? (
                    <p>--</p>
                  ) : (
                    <p className="text-black dark:text-white">
                      {access?.department}
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
