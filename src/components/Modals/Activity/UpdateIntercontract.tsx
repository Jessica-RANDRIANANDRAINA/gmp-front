import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { ITransverseAdd } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { intercontractType } from "../../../constants/Activity";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import { updateIntercontract } from "../../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateIntercontract = ({
  modalUpdateOpen,
  intercontract,
  setModalUpdateOpen,
  setIsRefreshNeeded,
}: {
  modalUpdateOpen: boolean;
  intercontract: any;
  setModalUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRefreshNeeded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [intercontractData, setIntercontractData] = useState<ITransverseAdd>({
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
    if (intercontract?.content) {
      setIntercontractData({
        id: intercontract?.content?.id,
        title: intercontract?.content?.title,
        description: intercontract?.content?.description,
        startDate: intercontract?.content?.startDate,
        dailyEffort: intercontract?.content?.dailyEffort,
        type: intercontract?.content?.type,
        status: intercontract?.content?.status,
      });
    }
  }, [intercontract]);

  const handleCloseModal = () => {
    setModalUpdateOpen(false);
  };
  const handleUpdateIntercontract = async () => {
    setIsLoading(true);
    try {
      const dataToSend = {
        title: intercontractData.title,
        startDate: intercontractData.startDate,
        dailyEffort: intercontractData.dailyEffort,
        type: intercontractData.type,
        description: intercontractData.description,
        status: intercontractData.status,
      };
      if (intercontractData.id) {
        await updateIntercontract(intercontractData.id, dataToSend);
        setIsRefreshNeeded(true);
        notyf.success("Modification de l'intercontract réussi");
        handleCloseModal();
      }
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(`Error at update intercontract : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalUpdateOpen}
      setModalOpen={setModalUpdateOpen}
      header={`${intercontract?.content?.title}`}
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
              value={intercontractData.title}
              onChange={(e) => {
                setIntercontractData({
                  ...intercontractData,
                  title: e.target.value,
                });
              }}
            />
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomSelect
                required={true}
                label="Type"
                data={intercontractType}
                value={intercontractData.type}
                onValueChange={(e) => {
                  setIntercontractData({
                    ...intercontractData,
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
                value={intercontractData.status}
                onValueChange={(e) => {
                  setIntercontractData({
                    ...intercontractData,
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
                  intercontractData?.startDate
                    ? intercontractData?.startDate?.split("T")?.[0]
                    : ""
                }
                onChange={(e) => {
                  setIntercontractData({
                    ...intercontractData,
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
                value={intercontractData.dailyEffort}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (value > 8) value = 8;
                  if (value < 1) value = 1;
                  setIntercontractData({
                    ...intercontractData,
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
              value={intercontractData.description}
              onChange={(e) => {
                setIntercontractData({
                  ...intercontractData,
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
            intercontractData?.title !== "" &&
            intercontractData?.type !== "" &&
            intercontractData.startDate !== ""
              ? false
              : true
          }
          onClick={handleUpdateIntercontract}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md  text-white font-semibold ${
            intercontractData?.title !== "" &&
            intercontractData?.type !== "" &&
            intercontractData.startDate !== ""
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

export default UpdateIntercontract;
