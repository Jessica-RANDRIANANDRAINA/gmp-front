import { useRef } from "react";
import { CustomInput, CustomSelect } from "../UIElements";
import { UserInterface } from "../../types/user";

const ModifyHierarchy = ({
  setIsModifyHierarchyOpen,
  userToModify,
}: {
  setIsModifyHierarchyOpen: Function;
  userToModify: UserInterface | null;
}) => {
  const trigger = useRef<any>(null);
  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className="bg-white dark:bg-[#24303F] rounded-md w-full md:w-2/4 p-4"
      >
        {/* =====HEADER START===== */}
        <header className={"flex justify-between w-full  h-12"}>
          <div className={"font-bold"}>Modifier le supérieur direct de :</div>
          <div
            className={"cursor-pointer"}
            onClick={() => setIsModifyHierarchyOpen(false)}
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
          <form action="">
            <CustomInput
              label="Supérieur actuel"
              type="text"
              rounded="medium"
              className="p-4 w-full"
              value={userToModify?.name}
              disabled
            />
            <CustomSelect
              label="Nouveau supérieur"
              placeholder=""
              data={[]}
              value={""}
              onValueChange={(e) => {
                // setSearch({
                //   ...search,
                //   department: e,
                // });
                console.log(e);
              }}
            />
            <input
              type="submit"
              value={"Modifier"}
              className="w-full cursor-pointer mt-4 py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifyHierarchy;
