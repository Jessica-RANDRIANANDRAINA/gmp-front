import { useEffect, useState } from "react";
import UserModifModal from "../Modals/UserModifModal";
import { CustomInput, CustomSelect } from "../UIElements";
import { getAllDepatments } from "../../services/User";
import Pagination from "./Pagination";

const TableUser = ({ data }: { data: Array<any> }) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);
  const [search, setSearch] = useState({
    nameAndMail: "",
    department: "",
    access: "",
  });
  const [userModif, setUserModif] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [dataSorted, setDataSorted] = useState({
    name: true,
    email: true,
    department: true,
  });
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [userSelected, setUserSelected] = useState<string[]>([]);

  const filteredData = data.filter((item) => {
    const lowerCaseSearchName = search.nameAndMail.toLowerCase();
    var lowerCaseDepartment = search.department.toLowerCase();

    if (lowerCaseDepartment !== "") {
      lowerCaseDepartment === "vide"
        ? (lowerCaseDepartment = "")
        : (lowerCaseDepartment = lowerCaseDepartment);
      return (
        (item.name.toLowerCase().includes(lowerCaseSearchName) ||
          item.email.toLowerCase().includes(lowerCaseSearchName)) &&
        item.department.toLowerCase() === lowerCaseDepartment
      );
    } else {
      return (
        item.name.toLowerCase().includes(lowerCaseSearchName) ||
        item.email.toLowerCase().includes(lowerCaseSearchName)
      );
    }
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
    setUserSelected([]);
    setIsAllSelected(false);
  }, [search]);

  useEffect(() => {
    const fetchDepartment = async () => {
      const depart = await getAllDepatments();
      setDepartments(depart);
    };

    fetchDepartment();
  }, []);

  const handleDeleteFilter = () => {
    setSearch({
      ...search,
      nameAndMail: "",
      department: "",
    });
  };
  const handleSelectAllUser = () => {
    if (userSelected.length < filteredData.length) {
      setUserSelected([]);
      filteredData.map((u) => setUserSelected((prev) => [...prev, u.id]));
      setIsAllSelected(true);
    } else {
      setUserSelected([]);
      setIsAllSelected(false);
    }
  };

  return (
    <div className="bg-white  pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* ==== FILTER START ===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
          <CustomInput
            type="text"
            value={search.nameAndMail}
            label="Recherche"
            placeholder="Nom ou mail"
            rounded="medium"
            onChange={(e) => {
              setSearch({
                ...search,
                nameAndMail: e.target.value,
              });
            }}
          />
          <CustomSelect
            label="Département"
            placeholder="Département"
            data={departments}
            value={search.department}
            onValueChange={(e) => {
              setSearch({
                ...search,
                department: e,
              });
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
      {/* ==== FILTER END ===== */}
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
          Listes de tous les utilisateurs
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
          userSelected.length > 0
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0"
        }`}
      >
        <div> {userSelected.length} éléments séléctionné </div>
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
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      <div className="max-w-full mb-4 overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="pt-5 rounded-t-xl bg-primaryGreen">
            <tr className="border border-stone-300 border-opacity-[0.1] border-r-0 border-l-0 text-white text-left">
              <th className="pl-2">
                <button
                  onClick={handleSelectAllUser}
                  className="cursor-pointer border w-5 h-5"
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${
                      userSelected.length === filteredData.length
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
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        name: !dataSorted.name,
                      });
                    }}
                    className={`${
                      dataSorted.name ? "" : "rotate-180"
                    } transform transition-transform duration-200`}
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
                  <span>Nom</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        email: !dataSorted.email,
                      });
                    }}
                    className={`${
                      dataSorted.email ? "" : "rotate-180"
                    } transform transition-transform duration-200`}
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Email</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setDataSorted({
                        ...dataSorted,
                        department: !dataSorted.department,
                      });
                    }}
                    className={`${
                      dataSorted.department ? "" : "rotate-180"
                    } transform transition-transform duration-200`}
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <span>Département</span>
                </div>
              </th>
              <th className="py-4 px-4 font-bold text-white dark:text-white xl:pl-11">
                Accès
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              ?.filter((_user, index) => indexInPaginationRange(index))
              .filter((user) => {
                const name = user?.name?.toLowerCase();
                const email = user?.email?.toLowerCase();
                const department = user?.department?.toLowerCase();
                const searchQuery = search.nameAndMail.toLowerCase();
                const searchDepartQuery =
                  search.department.toLowerCase() === "vide"
                    ? ""
                    : search.department.toLowerCase();

                return (
                  name.includes(searchQuery) ||
                  email.includes(searchQuery) ||
                  department === searchDepartQuery
                );
              })
              .map((user) => (
                <tr
                  key={user?.id}
                  className="hover:bg-whiten dark:hover:bg-whitenGreen"
                >
                  <td className="pl-2">
                    <button
                      className="cursor-pointer border w-5 h-5"
                      onClick={() => {
                        setUserSelected((prev) => {
                          if (prev?.includes(user.id)) {
                            return prev.filter((id) => id !== user.id);
                          } else {
                            return [...prev, user.id];
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
                          userSelected.includes(user.id)
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
                    <p className="text-black dark:text-white">
                      {user?.name?.split("(")?.[0]}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">{user?.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="text-black dark:text-white">
                      {user?.department}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <span className="text-white border  border-orange bg-orange py-1 px-2 rounded-2xl dark:text-white">
                      Visualisation
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* ===== PAGINATE BEGIN ===== */}
      <div className="flex flex-col md:flex-row justify-end px-4 items-center">
        <div>
          <CustomSelect
            label="Par page: "
            data={["5", "10", "15", "20"]}
            placeholder="5"
            className="flex"
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
      {/* ===== PAGINATE END ===== */}
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
