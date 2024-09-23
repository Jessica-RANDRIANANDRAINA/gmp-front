import React, { useRef, useEffect, ReactNode } from "react";

const Modal = ({
  header,
  setModalOpen,
  children,
}: {
  header: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  const trigger = useRef<any>(null);
  return (
    <div className="fixed inset-0 flex justify-center place-items-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        className="bg-white dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4"
      >
        {/* ===== HEADER START ====== */}
        <header className="flex justify-between w-full h-12">
          <div className="font-bold">{header}</div>
          <div className={"cursor-pointer"} onClick={() => setModalOpen(false)}>
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
        {/* ===== HEADER END ====== */}
        {/* ===== BODY END ====== */}
        <div>{children}</div>
        {/* ===== BODY END ====== */}
      </div>
    </div>
  );
};

export default Modal;
