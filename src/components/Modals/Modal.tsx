import React, { useRef, useEffect, ReactNode, useState } from "react";

const ModalBody = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-sm flex-grow h-[50%] overflow-y-auto ">
      <div className="relative">{children}</div>
    </div>
  );
};

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className="sticky">{children}</div>;
};

const Modal = ({
  header,
  modalOpen,
  setModalOpen,
  children,
  heightSize,
}: {
  header: string;
  modalOpen: Boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
  heightSize: string;
}) => {
  const trigger = useRef<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);

  // close in click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modalOpen  && trigger.current.contains(target))
        return setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    setShowModal(true);
  }, []);

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setModalOpen(false);
    }, 200);
  };

  return (
    <div className="fixed m-0 inset-0 flex justify-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        style={{ maxHeight: heightSize }}
        className={`bg-white h-fit  my-20 dark:bg-[#24303F] rounded-md w-5/6 md:w-1/3 p-4 transfrom transition-all duration-300 ease-out ${
          showModal && !closingModal
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90"
        } flex flex-col`}
      >
        {/* ===== HEADER START ====== */}
        <header className="flex justify-between w-full h-12">
          <div className="font-semibold text-sm sticky">{header}</div>
          <div className={"cursor-pointer"} onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="size-3"
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
        {/* ===== BODY AND FOOTER START ====== */}
        {children}
        {/* ===== BODY AND FOOTER END ====== */}
      </div>
    </div>
  );
};

export { Modal, ModalBody, ModalFooter };
