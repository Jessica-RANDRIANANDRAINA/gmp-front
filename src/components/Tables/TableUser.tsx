import { useEffect, useState } from "react";
import UserModifModal from "../Modals/UserModifModal";
import { CustomInput, CustomSelect } from "../UIElements";

const TableUser = ({ data }: { data: Array<any> }) => {
  const [userModif, setUserModif] = useState(false);

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
      {/* =====TABLE START===== */}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen">
            <tr className=" border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className=" pl-2 ">
                <p className="cursor-pointer border w-5 h-5"></p>
              </th>
              <th className="py-4 px-4 font-bold  text-white dark:text-white xl:pl-11">
                Nom
              </th>
              <th className="py-4 px-4 font-bold  text-white dark:text-white xl:pl-11">
                Email
              </th>
              <th className="py-4 px-4 font-bold  text-white dark:text-white xl:pl-11">
                Département
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
                <p className="cursor-pointer border w-5 h-5"></p>
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
