import { useRef, useEffect } from "react";

const UserModifModal = ({
  userModif,
  setUserModifs,
}: {
  userModif: boolean;
  setUserModifs: Function;
}) => {
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !userModif ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
        setUserModifs(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });
  return (
    <div  className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
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
          <div> HERE</div>
        </div>
      </div>
    </div>
  );
};

export default UserModifModal;
