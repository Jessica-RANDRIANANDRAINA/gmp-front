import { useState, useEffect } from "react";

const TableAccess = () => {
  return (
    <div className="bg-white pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div>
          <button className="w-full cursor-pointer mt-2 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90">
            Ajouter un accès
          </button>
        </div>
        {/* =====FILTER START===== */}
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full ">
          aefibaeufb
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
      {/* =====TABLE START===== */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className=" pl-2 ">
                <button
                  //   onClick={() => setIsAllSelected(!isAllSelected)}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    // className={`${isAllSelected ? "visible" : "invisible"}`}
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
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Nom
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Visuel
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Management
              </th>
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                Département
              </th>
            </tr>
          </thead>
        </table>
      </div>
      {/* =====TABLE END===== */}
    </div>
  );
};

export default TableAccess;
