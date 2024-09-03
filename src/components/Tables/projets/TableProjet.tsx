import { useEffect, useState } from "react";
import { CustomInput, CustomSelect } from "../../UIElements";

const TableProjet = ({ data }: { data: Array<any> }) => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [actualPage, setActualPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState(1);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [projectSelected, setProjectSelected] = useState<string[]>([]);

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

  return (
    <div className="bg-white  pt-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* ===== FILTER START ===== */}
      <div className="flex m-5 flex-wrap justify-between items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-3 w-full">
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
      {/* ===== FILTER END ===== */}
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
          {/* <CustomSelect
            data={["Modifier habilitation(s)", "Supprimer habilitation(s)"]}
            className="mb-2  "
            placeholder="Actions"
            onValueChange={(e) => {
              console.log(e);
              if (e.includes("Modifier")) {
                setUserModif(true);
              } else {
                setUserDelete(true);
              }
            }}
          /> */}
        </div>
      </div>
      {/* ===== BULK END ===== */}
      {/* =====TABLE START===== */}
      {/* =====TABLE END===== */}
      <div></div>
    </div>
  );
};

export default TableProjet;
