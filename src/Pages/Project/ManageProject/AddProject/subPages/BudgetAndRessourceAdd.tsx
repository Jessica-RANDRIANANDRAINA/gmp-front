import { useState } from "react";
import {
  CustomInput,
  CustomSelect,
} from "../../../../../components/UIElements";
import { IRessource, IProjectData, IBudget } from "../../../../../types/Project";
import { v4 as uuid4 } from "uuid";

const BudgetAndRessourceAdd = ({
  setPageCreate,
  pageCreate,
  // setProjectData,
  // projectData,
  departments,
  setRessourceList,
  ressourceList,
  budgetList, 
  setBudgetList,
}: {
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  pageCreate: number;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
  projectData: IProjectData;
  departments: string[];
  setRessourceList: React.Dispatch<React.SetStateAction<Array<IRessource>>>;
  ressourceList: IRessource[];
  budgetList: IBudget[];
  setBudgetList: React.Dispatch<React.SetStateAction<Array<IBudget>>>;
}) => {
  const [haveBudget] = useState(false);

  // ADD BUDGET LIST
  const handleAddBudgetToList = () => {
    let budgetData: IBudget = {
      id: uuid4(),
      code: "",
      anneebudget: "",
      direction: "",
      amount: 0,
      currency: "MGA",
    };
    setBudgetList([...budgetList, budgetData]);
  };

  //REMOVE A BUDGET TO THE LIST
  const handleRemoveBudgetFromList = (id: string) => {
    let filteredList = budgetList.filter((budget) => budget.id !== id);
    setBudgetList(filteredList);
  };

  const handleBudgetDataChange = (
    field: string,
    index: number,
    value: string | number
  ) => {
    setBudgetList((prevState) => {
    const newBudgets = [...prevState];
    newBudgets[index] = { ...newBudgets[index], [field]: value };
    return newBudgets;
  });
  };


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
    field: string,
    index: number,
    value: string
  ) => {
    setRessourceList((prevState) => {
      const newRessources = [...prevState];
      newRessources[index] = { ...newRessources[index], [field]: value };
      return newRessources;
    });
  };
  return (
    <form
      className={`space-y-2 transition-all duration-1000 ease-in-out ${
        pageCreate === 2 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (form.reportValidity()) {
          setPageCreate(3);
        }
      }}
    >
      <div className="space-y-4 ">
        <div>
          <span className="font-semibold tracking-wide">BUDGETS</span>
          <div className="space-y-4">
            {budgetList?.map((budget, index) => (
              <div key={budget.id} className="p-4 rounded-lg">
                <div className="flex justify-between">
                  <div className="underline">Budget {index+1}</div>
                  <button 
                    type="button"
                    className="text-red-500 decoration-red-500 border-rose-200 rounded-md hover:bg-rose-100 dark:border-rose-300 dark:hover:bg-rose-400 dark:hover:text-rose-100 border p-2 font-bold hover:font-black"
                    onClick={() => {
                      handleRemoveBudgetFromList(budget.id);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
                <CustomInput 
                  label="Année"
                  type="text"
                  placeholder="2025"
                  rounded="medium"
                  value={budget.anneebudget}
                  onChange={(e) => {
                    handleBudgetDataChange("anneebudget", index, e.target.value);
                  }}
                  required
                />
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <CustomInput
                    label="Code"
                    type="text"
                    rounded="medium"
                    placeholder="Code budget"
                    value={budget.code}
                    onChange={(e) => {
                      handleBudgetDataChange("code", index, e.target.value);
                    }}
                    required
                  />
                  <CustomSelect 
                    label="Direction sponsor"
                    placeholder="Choisir une direction"
                    data={departments}
                    value={budget.direction}
                    onValueChange={(e) => {
                      handleBudgetDataChange("direction", index, e);
                    }}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <CustomInput 
                    label="Montant du budget"
                    type="number"
                    step={0.01}
                    min={0}
                    rounded="medium"
                    placeholder="0"
                    value={budget.amount}
                    required
                    onChange={(e) => {
                      handleBudgetDataChange(
                        "amount", 
                        index, 
                        parseFloat(parseFloat(e.target.value).toFixed(2)));
                    }}
                  />
                   <CustomSelect
                    label="Devise"
                    placeholder=" "
                    data={["MGA", "EUR"]}
                    value={budget.currency}
                    onValueChange={(e) => {
                      handleBudgetDataChange("currency", index, e);
                    }}
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddBudgetToList}
              className="py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2"
            >
              + Ajouter un budget
            </button>
          </div>
          
          {/* taloh */}
          {/* <button
            onClick={() => {
              setHaveBudget(true);
            }}
            type="button"
            className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2 ${
              haveBudget ? "hidden" : ""
            }`}
          >
            + Ajouter un budget
          </button> */}
          {/* {haveBudget && (
            <>
              <div className="flex justify-between">
                <div></div>
                <button
                  type="button"
                  className={`
                      text-red-500 decoration-red-500 border-rose-200 rounded-md hover:bg-rose-100 dark:border-rose-300 dark:hover:bg-rose-400 dark:hover:text-rose-100 border p-2 font-bold hover:font-black
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
          )} */}
        </div>
        <div>
          {/* ===== RESSOURCES START ===== */}
          <span className="font-semibold tracking-wide">
            RESSOURCES
          </span>
          <div
            className={`   overflow-y-auto ${
              haveBudget
                ? "xl:max-h-75 md:max-h-60"
                : "xl:max-h-115 md:max-h-72"
            }`}
          >
            {ressourceList?.map((ressouce, index) => (
              <div key={ressouce.id}>
                <div className={"flex justify-between"}>
                  <div className={"underline"}>Ressource {index + 1}</div>
                  <button
                    type="button"
                    className={`
                      text-red-500 decoration-red-500 border-rose-200 rounded-md hover:bg-rose-100 dark:border-rose-300 dark:hover:bg-rose-400 dark:hover:text-rose-100 border p-2 font-bold hover:font-black
                      `}
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
                      handleRessourceDataChange("type", index, e);
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
              + Ajouter une ressource
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
  );
};

export default BudgetAndRessourceAdd;
