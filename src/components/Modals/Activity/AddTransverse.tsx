import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput, CustomSelect } from "../../UIElements";
import { BeatLoader } from "react-spinners";
import { createTransverse } from "../../../services/Project";
import { v4 as uuid4 } from "uuid";
import { ITransverseAdd } from "../../../types/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { transverseType } from "../../../constants/Activity";
import { getMondayAndFriday } from "../../../services/Function/DateServices";
const notyf = new Notyf({ position: { x: "center", y: "top" } });

const AddTransverse = ({
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
  const [transverseData, setTransverseData] = useState<ITransverseAdd>({
    title: "",
    description: "",
    type: "",
    dailyEffort: 1,
    startDate: "",
  });

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateTransverse = async () => {
    setIsLoading(true);
    try {
      const id = uuid4();
      const dataToSend = {
        id,
        dailyEffort: transverseData.dailyEffort,
        description: transverseData.description,
        startDate: transverseData.startDate,
        status: "Backlog",
        title: transverseData.title,
        type: transverseData.type,
        userid,
      };
      await createTransverse(dataToSend);
      notyf.success("Création de la tâche tranverse réussie.");

      setIsAddFinished(true);
      handleCloseModal();
    } catch (error) {
      notyf.error(
        "Une erreur s'est produite lors de la création de la tâche transverse, veuillez réessayer plus tard."
      );
      console.error(`Error at create transverse: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une tâche transverse"
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
            <div className="flex *:w-full flex-wrap md:flex-nowrap gap-2">
              <CustomInput
                required={true}
                type="date"
                label="Au date du"
                rounded="medium"
                className="text-sm"
                min={monday}
                max={friday}
                value={transverseData?.startDate}
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
          onClick={handleCreateTransverse}
          className={`border flex justify-center items-center dark:border-boxdark text-xs p-2 rounded-md  text-white font-semibold ${
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
          Créer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTransverse;
