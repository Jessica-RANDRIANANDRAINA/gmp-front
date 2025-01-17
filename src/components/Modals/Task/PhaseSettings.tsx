import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomSelect, CustomInput } from "../../UIElements";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { getPhaseById, updatePhaseSettings } from "../../../services/Project";
import { decodeToken } from "../../../services/Function/TokenService";
import { formatDate } from "../../../services/Function/DateServices";
import { IPhase } from "../../../types/Project";
import { BeatLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const PhaseSettings = ({
  showModalSettings,
  setShowModalSettings,
}: {
  showModalSettings: boolean;
  setShowModalSettings: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { phaseId } = useParams();
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataToModif, setDataToModif] = useState({
    status: "A faire",
    listDeliverables: [],
  });
  const [ableToEnd, setAbleToEnd] = useState<boolean>(false);
  const [datePhase, setDatePhase] = useState({
    startDate: "",
    endDate: "",
  });
  useEffect(() => {
    var start = "";
    var end = "";
    if (phaseData?.startDate) {
      start = formatDate(phaseData?.startDate);
    }
    if (phaseData?.endDate) {
      end = formatDate(phaseData?.endDate);
    }
    setDatePhase({
      startDate: start,
      endDate: end,
    });
  }, [phaseData]);

  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        const statusArray = ["Backlog", "En cours", "En pause"];

        const hasIncompleteTask = data?.tasks?.some(
          (task: { status: string }) => statusArray.includes(task.status)
        );

        setAbleToEnd(!hasIncompleteTask);

        setPhaseData({
          ...data,
          listDeliverables: data.listDeliverables ?? [],
        });
        setDataToModif({
          ...dataToModif,
          status: data?.status ?? "A faire",
          listDeliverables: data.listDeliverables ?? [],
        });
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };
  useEffect(() => {
    fetchDataPhase();
  }, []);

  const handleLinkChange = (livrableId: string, link: string) => {
    const userConnected = decodeToken("pr");
    setPhaseData((prevData) => {
      if (!prevData) {
        return prevData;
      }
      return {
        ...prevData,
        initiator: userConnected?.name,
        listDeliverables: prevData.listDeliverables.map((livrable) =>
          livrable.id === livrableId
            ? { ...livrable, expectedDeliverable: link }
            : livrable
        ),
      };
    });
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (phaseId) {
        await updatePhaseSettings(phaseId, phaseData);
        notyf.success("Modification apportée avec succès");
        setShowModalSettings(false);
      }
    } catch (error) {
      notyf.error("Modification échouée, veuillez reessayer.");
      console.error(
        `Error at handle confirm update status and deliverable: ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      modalOpen={showModalSettings}
      setModalOpen={setShowModalSettings}
      header={`Phase ${phaseData?.phase1}`}
      heightSize="80vh"
      widthSize="medium"
      overflow=""
    >
      <ModalBody>
        <div className="space-y-2">
          <div>
            <div>Date de début : {datePhase?.startDate}</div>
            <div>Date de fin : {datePhase?.endDate}</div>
          </div>
          <div className=" space-y-2 ">
            <CustomSelect
              label="Status"
              placeholder=""
              data={
                ableToEnd
                  ? ["A faire", "En cours", "Terminé"]
                  : ["A faire", "En cours"]
              }
              value={phaseData?.status ?? "A faire"}
              onValueChange={(e) => {
                const userConnected = decodeToken("pr");
                setPhaseData({
                  ...phaseData,
                  status: e,
                  initiator: userConnected?.name,
                  listDeliverables: phaseData?.listDeliverables ?? [],
                });
              }}
            />
            {phaseData?.listDeliverables?.map((livrable) => (
              <>
                <CustomInput
                  label={`Lien vers le livrable : ${livrable.deliverableName}`}
                  type="text"
                  placeholder="ex : https://lien-vers-le-livrable"
                  rounded="medium"
                  className={`w-full ${ableToEnd ? "" : "hidden"}`}
                  help="Quand la phase est terminée veuillez mettre ici le lien vers le livrable attendu"
                  value={livrable?.expectedDeliverable ?? ""}
                  onChange={(e) => {
                    handleLinkChange(livrable.id, e.target.value);
                  }}
                />
              </>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-gray dark:border-formStrokedark hover:bg-zinc-100 dark:hover:bg-boxdark2"
          onClick={() => {
            setShowModalSettings(false);
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          className="border flex justify-center items-center text-xs p-2 rounded-md text-white  font-semibold border-primaryGreen bg-primaryGreen dark:border-darkgreen dark:bg-darkgreen hover:bg-opacity-90 "
          onClick={handleConfirm}
        >
          {isLoading ? (
            <BeatLoader size={8} className="mr-2" color="#fff" />
          ) : null}
          Modifier
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default PhaseSettings;
