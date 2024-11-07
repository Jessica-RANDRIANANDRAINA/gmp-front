import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { BeatLoader } from "react-spinners";
import { v4 as uuid4 } from "uuid";
import { ITransverseAdd } from "../../../types/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { intercontractType } from "../../../constants/Activity";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
import { createInterContract } from "../../../services/Project";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddIntercontract = ({
  modalOpen,
  setModalOpen,
  setIsAddFinished,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddFinished: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userid } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { monday, friday } = getMondayAndFriday();
  const [intercontractData, setIntercontractData] = useState<ITransverseAdd>({
    title: "",
    description: "",
    type: "",
    dailyEffort: 1,
    startDate: "",
  });
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateIntercontract = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      const dataToSend = {
        id,
        dailyEffort: intercontractData.dailyEffort,
        description: intercontractData.description,
        startDate: intercontractData.startDate,
        status: "Backlog",
        title: intercontractData.title,
        type: intercontractData.type,
        userid,
      };
      await createInterContract(dataToSend);
      notyf.success("Création de l'intercontrat réussie.");

      setIsAddFinished(true);
      handleCloseModal();
    } catch (error) {
      notyf.error("Une erreur s'est produite, veuillez réessayer plus tard.");
      console.error(`Error at create intercontract: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter un Intercontrat"
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
            <CustomSelect
              required={true}
              label="Type"
              data={intercontractType}
              value={intercontractData.type}
              onValueChange={(e) => {
                console.log(e);
                setIntercontractData({
                  ...intercontractData,
                  type: e,
                });
              }}
            />
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomInput
                required={true}
                type="date"
                label="Au date du"
                rounded="medium"
                className="text-sm"
                min={monday}
                max={friday}
                value={intercontractData?.startDate}
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
                  setIntercontractData({
                    ...intercontractData,
                    dailyEffort: parseInt(e.target.value),
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
          onClick={handleCreateIntercontract}
          className={` border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md   text-white font-semibold ${
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
          Créer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AddIntercontract;
