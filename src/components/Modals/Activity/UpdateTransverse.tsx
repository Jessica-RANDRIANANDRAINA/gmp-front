import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { ITransverseAdd } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { transverseType } from "../../../constants/Activity";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import { updateTransverse } from "../../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateTransverse = ({
  modalUpdateOpen,
  transverse,
  setModalUpdateOpen,
  setIsRefreshNeeded,
}: {
  modalUpdateOpen: boolean;
  transverse: any;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [transverseData, setTransverseData] = useState<ITransverseAdd>({
    id: "",
    title: "",
    type: "",
    description: "",
    startDate: undefined,
    dailyEffort: 1,
    status: "Backlog",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { monday, friday } = getMondayAndFriday();

  useEffect(() => {
    if (transverse?.content) {
      setTransverseData({
        id: transverse?.content?.id,
        title: transverse?.content?.title,
        description: transverse?.content?.description,
        startDate: transverse?.content?.startDate,
        dailyEffort: transverse?.content?.dailyEffort,
        type: transverse?.content?.type,
        status: transverse?.content?.status,
      });
    }
  }, [transverse]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };
  const handleUpdateTransverse = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {
        title: transverseData.title,
        startDate: transverseData.startDate,
        dailyEffort: transverseData.dailyEffort,
        type: transverseData.type,
        description: transverseData.description,
        status: transverseData.status,
      };
      if (transverseData.id) {
        await updateTransverse(transverseData.id, dataToSend);
        setIsRefreshNeeded(true);
        notyf.success("Modification de la tâche transverse réussi");
        handleCloseModal();
      }
    } catch (error) {
      notyf.error(
        "Une erreur s'est produite lors de la modification, veuillez réessayer plus tard"
      );
      console.error(`Error at update transverse : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      modalOpen={modalUpdateOpen}
      setModalOpen={setModalUpdateOpen}
      header={`${transverse?.content?.title}`}
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <>
          <div>
            <CustomInput
              required={true}
              type="text"
              label="Titre"
              rounded="medium"
              className="text-sm"
              value={transverseData.title}
              onChange={(e) => {
                setTransverseData({
                  ...transverseData,
                  title: e.target.value,
                });
              }}
            />
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomSelect
                required={true}
                label="Type"
                data={transverseType}
                value={transverseData.type}
                onValueChange={(e) => {
                  setTransverseData({
                    ...transverseData,
                    type: e,
                  });
                }}
              />
              <CustomSelect
                label="Statut"
                data={[
                  "Backlog",
                  "En cours",
                  "Traité",
                  "En pause",
                  "Abandonné",
                ]}
                value={transverseData.status}
                onValueChange={(e) => {
                  setTransverseData({
                    ...transverseData,
                    status: e,
                  });
                }}
              />
            </div>
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomInput
                required={true}
                type="date"
                label="Au date du"
                rounded="medium"
                className="text-sm"
                min={monday}
                max={friday}
                value={
                  transverseData?.startDate
                    ? transverseData?.startDate?.split("T")?.[0]
                    : ""
                }
                onChange={(e) => {
                  setTransverseData({
                    ...transverseData,
                    startDate: e.target.value,
                  });
                }}
              />
              <CustomInput
                type="number"
                min={1}
                max={8}
                label="Temps a consacré (heures)"
                rounded="medium"
                className="text-sm"
                value={transverseData.dailyEffort}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (value > 8) value = 8;
                  if (value < 1) value = 1;
                  setTransverseData({
                    ...transverseData,
                    dailyEffort: value,
                  });
                }}
              />
            </div>
            <CustomInput
              type="textarea"
              label="Description"
              rounded="medium"
              className="text-sm"
              rows={5}
              value={transverseData.description}
              onChange={(e) => {
                setTransverseData({
                  ...transverseData,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </>
      </ModalBody>
      <ModalFooter>
        <button
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
          type="button"
          onClick={handleCloseModal}
        >
          Annuler
        </button>
        <button
          type="button"
          disabled={
            transverseData?.title !== "" &&
            transverseData?.type !== "" &&
            transverseData.startDate !== ""
              ? false
              : true
          }
          onClick={handleUpdateTransverse}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md text-white font-semibold ${
            transverseData?.title !== "" &&
            transverseData?.type !== "" &&
            transverseData.startDate !== ""
              ? "cursor-pointer bg-green-700 hover:opacity-85"
              : "cursor-not-allowed bg-graydark"
          }`}
        >
          {isLoading ? (
            <BeatLoader size={5} className="mr-2" color={"#fff"} />
          ) : null}
          Sauvegarder
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateTransverse;
