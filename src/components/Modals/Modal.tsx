import React, { useRef, useEffect, ReactNode, useState } from "react";

const ModalBody = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-sm flex-grow h-[50%]  ">
      <div className="relative">{children}</div>
    </div>
  );
};

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="sticky pt-2 ">
      <div className="flex justify-end gap-2">{children}</div>
    </div>
  );
};

const size = {
  large: "w-5/6 md:w-1/2",
  medium: "w-5/6 md:w-2/5",
  small: "w-5/6 md:w-1/3",
  xs: "w-5/6 md:w-1/4",
};

const Modal = ({
  header,
  modalOpen,
  setModalOpen,
  children,
  heightSize,
  widthSize = "medium",
}: {
  header: string;
  modalOpen: Boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
  heightSize: string;
  widthSize?: "large" | "medium" | "small" | "xs";
  triggerCloseFromParent?: (closeModal: () => void) => void;
}) => {
  const trigger = useRef<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setModalOpen(false);
    }, 200);
  };

  // close in click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (trigger.current && !trigger.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (modalOpen) {
      document.addEventListener("mousedown", clickHandler);
    }

    return () => {
      document.removeEventListener("mousedown", clickHandler);
    };
  });

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="fixed m-0 inset-0 flex justify-center bg-black z-999999 bg-opacity-50">
      <div
        ref={trigger}
        style={{ maxHeight: heightSize }}
        className={`bg-white h-fit  my-20 dark:bg-[#24303F] rounded-md ${
          size[widthSize]
        } p-4 transfrom transition-all duration-300 ease-out ${
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
