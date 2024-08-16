import { useEffect, useState } from "react";
import UserModifModal from "../Modals/UserModifModal";
import { CustomInput, CustomSelect } from "../UIElements";

const TableUser = ({ data }: { data: Array<any> }) => {
  const [userModif, setUserModif] = useState(false);
  const [dataSorted, setDataSorted] = useState({
    name: true,
    email: true,
    department: true,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);

  const showData = () => {
    console.log(data);
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <div className=" bg-white pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="  grid md:grid-cols-4 grid-cols-1 gap-3 w-full ">
          <CustomInput
            type="text"
            label="Recherche"
            placeholder="Nom ou mail"
            rounded="medium"
          />
          <CustomSelect
            label="Département"
            placeholder="Département"
            data={["DSI", "DAF"]}
            onValueChange={() => {
              console.log("first");
            }}
          />
          <CustomSelect
            label="Accès"
            placeholder="Accès"
            data={["Total", "Client", "Manager"]}
            onValueChange={() => {
              console.log("first");
            }}
          />
          <div className="flex items-end pb-3 mx-2">
            <button className="flex justify-center  gap-1 h-fit">
              Effacer les filtres
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#00AE5D"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
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
        <div className="text-2xl  font-medium">Listes de tous les utilisateurs</div>
        <div >
          
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
            <tr className=" border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
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
              <th className="py-4 px-4   font-bold  text-white dark:text-white xl:pl-11">
                <button
                  onClick={() => {
                    setDataSorted({
                      ...dataSorted,
                      name: !dataSorted.name,
                    });
                  }}
                  className={`${
                    dataSorted.name ? "" : "rotate-180"
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
                Nom
              </th>
              <th className="py-4 px-4 font-bold    text-white dark:text-white xl:pl-11">
                <button
                  onClick={() => {
                    setDataSorted({
                      ...dataSorted,
                      email: !dataSorted.email,
                    });
                  }}
                  className={`${
                    dataSorted.email ? "" : "rotate-180"
                  } transform transition-transform duration-200  `}
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </button>
                Email
              </th>
              <th className="py-4 px-4 font-bold flex text-white dark:text-white xl:pl-11">
                <button
                  onClick={() => {
                    setDataSorted({
                      ...dataSorted,
                      department: !dataSorted.department,
                    });
                  }}
                  className={`${
                    dataSorted.department ? "" : "rotate-180"
                  } transform transition-transform duration-200  `}
                >
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </button>
                <span>Département</span>
              </th>
              <th className="py-4 px-4 font-bold  text-white dark:text-white xl:pl-11">
                Accès
              </th>
              <th className="py-4 px-4 font-bold  text-white dark:text-white xl:pl-11">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-whiten dark:hover:bg-whitenGreen">
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
                <p className="text-black dark:text-white">
                  Johanne RAZAFIMAHEFA
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">
                  johanne.razafimahefa@ravinala-airports.aero
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <p className="text-black dark:text-white">DSI</p>
              </td>
              <td className="border-b flex flex-wrap border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <span className="text-white border m-1 border-orange  bg-orange   py-1 px-2 rounded-2xl dark:text-white">
                  Visualisation
                </span>
                <span className="text-white border m-1 border-orange  bg-orange   py-1 px-2 rounded-2xl dark:text-white">
                  Gestion
                </span>
                <span className="text-white border m-1 border-orange  bg-orange   py-1 px-2 rounded-2xl dark:text-white">
                  Total
                </span>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <button
                  className=" hover:text-graydark dark:hover:text-white"
                  onClick={() => {
                    setUserModif(!userModif);
                  }}
                >
                  Modifier
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* =====TABLE END===== */}
      {/* =====MODAL USER MODIF START===== */}
      {userModif && (
        <UserModifModal setUserModifs={setUserModif} userModif={userModif} />
      )}
      {/* =====MODAL USER MODIF END===== */}
    </div>
  );
};

export default TableUser;
