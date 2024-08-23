import { useRef, useState } from "react";
import { CustomInput, MultiSelect, Checkbox } from "../../UIElements";

const AddAccessModal = ({
  accessAdd,
  setAccessAdd,
}: {
  accessAdd: boolean;
  setAccessAdd: Function;
}) => {
  // const [access, setAccess] = useState<string[]>([]);
  const [valueMulti, setValueMulti] = useState<any>();
  const trigger = useRef<any>(null);

  const handleModif = (e: any) => {
    e.preventDefault();
    console.log("-----------");
    console.log(valueMulti);
    console.log("-----------");
    return;
  };

  return (
    <div className="fixed  inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={"bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"}
      >
        {/* =====HEADER START===== */}
        <header className={"flex justify-between w-full  h-12"}>
          <div className={"font-bold"}>Ajouter un nouvel accès</div>
          <div className={"cursor-pointer"} onClick={() => setAccessAdd(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </header>
        {/* =====HEADER END===== */}
        {/* ===== BODY START ===== */}
        <div>
          <form onSubmit={handleModif}>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Admin
              </label>
              <div className="pl-3">
                <Checkbox label="Modifier la hiérarchie" />
                <Checkbox label="Créer un nouvel accès" />
                <Checkbox label="Modifier un accès" />
                <Checkbox label="Supprimer un accès" />
                <Checkbox label="Restorer la hiérarchie à la valeur d'Active directory" />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Projet
              </label>
              <div className="pl-3">
                <Checkbox label="Créer un nouveau projet" />
                <Checkbox label="Modifier un projet" />
                <Checkbox label="Supprimer un projet" />
                <Checkbox label="Assigner un projet" />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Transverse
              </label>
              <div className="pl-3">
                <Checkbox label="Créer un nouveau transverse" />
                <Checkbox label="Modifier un transverse" />
                <Checkbox label="Supprimer un transverse" />
              </div>
            </div>
            <div className="mb-4 border-b-2 border-b-slate-400">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Accès Inter-contrat
              </label>
              <div className="pl-3">
                <Checkbox label="Créer un nouveau Inter-contrat" />
                <Checkbox label="Modifier un Inter-contrat" />
                <Checkbox label="Supprimer un Inter-contrat" />
              </div>
            </div>
            
            {/* <MultiSelect
              id="aaa"
              label={"Accès"}
              placeholder="Accés disponible"
              value={["Visualisation", "Gestion", "Total"]}
              setValueMulti={setValueMulti}
            /> */}
            <input
              type="submit"
              value={"Ajouter"}
              className="w-full cursor-pointer mt-2 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            />
          </form>
        </div>
        {/* ===== BODY START ===== */}
      </div>
    </div>
  );
};

export default AddAccessModal;
