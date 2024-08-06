import { useRef, useEffect, useState } from "react";
import CustomInput from "../UIElements/Input/CustomInput";
import MultiSelect from "../UIElements/Select/MultiSelect";

const UserModifModal = ({
  userModif,
  setUserModifs,
}: {
  userModif: boolean;
  setUserModifs: Function;
}) => {
  const [access, setAccess] = useState<string[]>([]);
  const [valueMulti, setValueMulti] =useState<any>()
  const trigger = useRef<any>(null);

  const handleModif = (e: any) => {
    e.preventDefault()
    console.log("-----------")
    console.log(valueMulti)
    console.log("-----------")
    return;
  }

  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className={"bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"}
      >
        {/* =====HEADER START===== */}
        <header className={"flex justify-between w-full  h-12"}>
          <div className={"font-bold"}>Modifier les accès</div>
          <div
            className={"cursor-pointer"}
            onClick={() => setUserModifs(false)}
          >
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
        <div>
          <form onSubmit={handleModif}>
            <CustomInput
              label="Nom"
              type="text"
              rounded="medium"
              className="p-4 w-full"
              value={"Johanne RAZAFIMAHEFA"}
              disabled
            />
            <CustomInput
              label="Email"
              type="text"
              rounded="medium"
              className="p-4 w-full"
              value={"ST116@ravinala-airports.aero"}
              disabled
            />
            <MultiSelect
              id="aaa"
              label={"Accès"}
              placeholder="Accés disponible"
              value={["Visualisation", "Gestion", "Total"]}
              setValueMulti={setValueMulti}
            />
          <input
            type="submit"
            value={"Modifier les accès"}
            className="w-full cursor-pointer mt-2 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
          />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModifModal;
