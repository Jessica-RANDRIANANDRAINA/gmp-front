import {
  CustomInput,
  CustomSelect,
} from "../../../../../components/UIElements";
import { IProjectData, IRessource, IBudget } from "../../../../../types/Project";
import { v4 as uuid4 } from "uuid";

const BudgetAndRessourcesUpdate = ({
  pageCreate,
  setPageCreate,
  departments,
  ressourceList,
  setRessourceList,
  budgetList,
  setBudgetList, 
}: {
  pageCreate: number;
  setPageCreate: React.Dispatch<React.SetStateAction<number>>;
  projectData: IProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<IProjectData>>;
  departments: Array<string>;
  ressourceList: Array<IRessource>;
  setRessourceList: React.Dispatch<React.SetStateAction<Array<IRessource>>>;
  budgetList: IBudget[]; // Ajoutez cette ligne
  setBudgetList: React.Dispatch<React.SetStateAction<IBudget[]>>; // Ajoutez cette ligne
}) => {
  

  // ADD BUDGET LIST
  const handleAddBudgetToList = () => {
    let newBudget: IBudget = {
      id: uuid4(),
      code: "",
      anneebudget: "",
      direction: "",
      amount: 0,
      currency: "MGA",
    };
    setBudgetList([...budgetList, newBudget]);
  };

  //REMOVE A BUDGET TO THE LIST
  const handleRemoveBudgetFromList = (id: string) => {
    let filteredList = budgetList.filter((budget: IBudget) => budget.id !== id);
    setBudgetList(filteredList);
  };

  const handleBudgetDataChange = (
    field: string,
    index: number,
    value: string | number
  ) => {
    setBudgetList((prevState: IBudget[]) => {
      const newBudgets = [...prevState];
      newBudgets[index] = { ...newBudgets[index], [field]: value};
      return newBudgets;
    });
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

  return (
    <form
      className={`space-y-2 transition-all duration-300 ease-in-out ${
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
      <div className="space-y-4">
        <div>
          <span className="font-semibold tracking-wide">BUDGETS</span>
          <div className="space-y-4">
            {budgetList?.map((budget: IBudget, index: number) => (
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
                  value={budget.anneebudget || ""}
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
                    value={budget.code || ""}
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
        </div>
        <div>
          {/* ===== RESSOURCES START ===== */}
          <span className="font-semibold tracking-wide">
            RESSOURCES
          </span>
          <div className="overflow-y-auto">
            {ressourceList?.map((ressource, index) => {
              return (
                <div key={ressource.id}>
                  <div className={"flex justify-between"}>
                    <div className={"underline"}>Ressource {index + 1}</div>
                    <button
                      className={`
                        text-red-500 decoration-red-500 border-rose-200 rounded-md hover:bg-rose-100 dark:border-rose-300 dark:hover:bg-rose-400 dark:hover:text-rose-100 border p-2 font-bold hover:font-black
                        `}
                      onClick={() => {
                        handleRemoveRessourceToList(ressource.id);
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
                      value={ressource?.source}
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
                      value={ressource.type}
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
                    placeholder="La ressource ex: un serveur"
                    value={ressource.ressource}
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
              );
            })}
            <button
              onClick={handleAddRessourceToList}
              type="button"
              className={`py-2 w-full mt-2 text-center border border-dashed border-stroke rounded-md hover:bg-stroke dark:hover:bg-boxdark2`}
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
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-semibold text-zinc-700 dark:text-whiten hover:bg-zinc-50 lg:px-8 xl:px-5 border border-zinc-300 rounded-lg  dark:bg-transparent dark:hover:bg-boxdark2"
          >
            Précédent
          </button>
          <button
            type="submit"
            className="md:w-fit gap-2 w-full cursor-pointer mt-2 py-2 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90"
          >
            Suivant
          </button>
        </div>
      </div>
    </form>
  );
};

export default BudgetAndRessourcesUpdate;