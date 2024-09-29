import { useState } from "react";
import {
  CustomInput,
  CustomSelect,
} from "../../../../../components/UIElements";
import {
  IRessource,
  IProjectData,
} from "../../../../../types/Project";
import { v4 as uuid4 } from "uuid";

const BudgetAndRessourceAdd = ({
  setPageCreate,
  pageCreate,
  setProjectData,
  projectData,
  departments,
  setRessourceList,
  ressourceList
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  pageCreate: number;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
  projectData: IProjectData;
  departments: string[];
  setRessourceList: React.Dispatch<React.SetStateAction<Array<IRessource>>>
  ressourceList: IRessource[]
}) => {
  const [haveBudget, setHaveBudget] = useState(false);


  // ADD RESSOURCE LIST
  const handleAddRessourceToList = () => {
    let ressourceData: IRessource = {
      id: uuid4(),
      ressource: "",
      source: "",
      type: "",
    };
    setRessourceList([...ressourceList, ressourceData]);
  };

  // REMOVE A RESSOURCE TO THE LIST
  const handleRemoveRessourceToList = (id: string) => {
    let filteredList = ressourceList.filter((ressource) => ressource.id !== id);
    setRessourceList(filteredList);
  };

  const handleRessourceDataChange = (
    valueToChange: string,
    index: number,
    value: string
  ) => {
    let data = ressourceList;
    if (valueToChange === "source") {
      data[index].source = value;
    } else if (valueToChange === "etat") {
      data[index].type = value;
    } else if (valueToChange === "ressource") {
      data[index].ressource = value;
    }
    setRessourceList(data);
  };
  return (
    <form
      className={`space-y-2 transition-all duration-1000 ease-in-out ${pageCreate === 2 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (form.reportValidity()) {
          console.log("-------")
          setPageCreate(3);
          console.log("-------")
        }
      }}
    >
      <div className="space-y-4 ">
        <div>
          <span className="font-semibold tracking-wide underline">
            BUDGET
          </span>
          <button
            onClick={() => {
              setHaveBudget(true);
            }}
            type="button"
            className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2 ${haveBudget ? "hidden" : ""
              }`}
          >
            Est-ce que ce projet a un budget ?
          </button>
          {haveBudget && (
            <>
              <div className="flex justify-between">
                <div></div>
                <button
                  type="button"
                  className={`
                      text-red-500 decoration-red-500 font-bold hover:font-black
                      `}
                  onClick={() => {
                    setHaveBudget(false);
                  }}
                >
                  Supprimer
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <CustomInput
                  label="Code"
                  type="text"
                  rounded="medium"
                  placeholder="Code budget"
                  value={projectData?.codeBuget}
                  onChange={(e) => {
                    setProjectData({
                      ...projectData,
                      codeBuget: e.target.value,
                    });
                  }}
                />
                <CustomSelect
                  label="Direction sponsor"
                  placeholder="Choisir une direction"
                  data={departments}
                  value={projectData.directionSourceBudget}
                  onValueChange={(e) => {
                    setProjectData({
                      ...projectData,
                      directionSourceBudget: e,
                    });
                  }}
                  required={haveBudget}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <CustomInput
                  label="Montant du budget"
                  type="number"
                  step={0.01}
                  min={0}
                  rounded="medium"
                  placeholder="0"
                  // value={projectData?.budgetAmount ?? 0}
                  required={haveBudget}
                  onChange={(e) => {
                    setProjectData({
                      ...projectData,
                      budgetAmount: parseFloat(
                        parseFloat(e.target.value).toFixed(2)
                      ),
                    });
                  }}
                />
                <CustomSelect
                  label="Devise"
                  placeholder=" "
                  data={["MGA", "EUR"]}
                  value={projectData.budgetCurrency}
                  onValueChange={(e) => {
                    setProjectData({
                      ...projectData,
                      budgetCurrency: e,
                    });
                  }}
                />
              </div>
            </>
          )}
        </div>
        <div >
          {/* ===== RESSOURCES START ===== */}
          <span className="font-semibold tracking-wide underline">
            RESSOURCES
          </span>
          <div className=" md:max-h-60  overflow-y-auto">
            {ressourceList?.map((ressouce, index) => (
              <div key={ressouce.id}>
                <div className={"flex justify-between"}>
                  <div className={"underline"}>Ressource {index + 1}</div>
                  <button
                    type="button"
                    className={
                      "text-red-500 decoration-red-500 font-bold hover:font-black"
                    }
                    onClick={() => {
                      handleRemoveRessourceToList(ressouce.id);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <CustomInput
                    label="Source"
                    type="text"
                    rounded="medium"
                    placeholder="Ex: Massin"
                    onChange={(e) => {
                      handleRessourceDataChange(
                        "source",
                        index,
                        e.target.value
                      );
                    }}
                  />
                  <CustomSelect
                    label="Etat"
                    placeholder="Disponible"
                    data={["A acquérir", "Disponible"]}
                    value={ressouce.type}
                    onValueChange={(e) => {
                      handleRessourceDataChange("etat", index, e);
                    }}
                    required
                  />
                </div>
                <CustomInput
                  label="Resssource"
                  type="textarea"
                  rounded="medium"
                  placeholder="La ressouce ex: un serveur"
                  onChange={(e) => {
                    handleRessourceDataChange(
                      "ressource",
                      index,
                      e.target.value
                    );
                  }}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRessourceToList}
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2 `}
            >
              Ajouter une ressource
            </button>
          </div>
          {/* ===== RESSOURCES END ===== */}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setPageCreate(1)}
            type="button"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg  dark:bg-transparent dark:hover:bg-boxdark2 "
          >
            Précédent
          </button>
          <button
            // onClick={() => setPageCreate(3)}
            type="submit"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
    </form>
  )
}

export default BudgetAndRessourceAdd