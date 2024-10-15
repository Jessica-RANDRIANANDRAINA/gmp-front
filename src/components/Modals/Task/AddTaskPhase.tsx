import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import { CustomInput } from "../../UIElements";
import ListUsers from "../../UIElements/ListUsers";
import { getPhaseById } from "../../../services/Project";
import { IPhase, IUserProject } from "../../../types/Project";

const AddTaskPhase = ({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { phaseId } = useParams();
  const [phaseData, setPhaseData] = useState<IPhase>();
  const [isDropdownUserOpen, setDropDownUserOpen] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<Array<IUserProject>>([]);

  const fetchDataPhase = async () => {
    try {
      if (phaseId) {
        const data = await getPhaseById(phaseId);
        setPhaseData(data);
        console.log(data);
      }
    } catch (error) {
      console.error("error at fetch data phase: ", error);
    }
  };

  useEffect(() => {
    fetchDataPhase();
  }, []);

  const handleAddUser = (user: {
    userid: string | undefined;
    projectid: any;
    role: any;
    name: any;
  }) => {
    if (!assignedPerson.some((u) => u.userid === user.userid)) {
      const formatUser = {
        userid: user.userid,
        projectid: user.projectid,
        role: user.role,
        user: {
          name: user.name,
        },
      };
      setAssignedPerson((prev) => [...prev, formatUser]);
    }
  };

  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      header="Ajouter une tache"
      heightSize="80vh"
      widthSize="medium"
    >
      <ModalBody>
        <>
          <div className="space-y-2">
            <div className="font-semibold text-xs">Assigné à:</div>
            <div className="grid grid-cols-3 place-content-center place-items-stretch">
              <div className="flex  items-center">
                <div>
                  <ListUsers data={assignedPerson} type="show" />
                </div>
                <span
                  onClick={() => {
                    setDropDownUserOpen(!isDropdownUserOpen);
                  }}
                  className="w-5 h-5 p-3 border flex rounded-full justify-center items-center cursor-pointer bg-zinc-200 dark:bg-boxdark  hover:bg-zinc-300 border-zinc-200 dark:hover:bg-boxdark2 dark:border-formStrokedark"
                >
                  +
                </span>
                <div
                  className={`absolute top-14  left-0 border dark:border-formStrokedark border-zinc-300 bg-white dark:bg-boxdark2 shadow-lg rounded-md z-50 transition-transform duration-300 ease-in-out ${
                    isDropdownUserOpen ? "scale-100" : "scale-0"
                  }`}
                  style={{ transformOrigin: "top left " }} // Définit l'origine de la transformation
                >
                  {isDropdownUserOpen && (
                    <div className="rounded-md">
                      {phaseData?.userProject
                        ?.filter(
                          (user) =>
                            !assignedPerson.some(
                              (u) => u.userid === user.userid
                            )
                        )
                        ?.map((user) => (
                          <div
                            key={user.userid}
                            className="p-2 first:rounded-t-md last:rounded-b-md hover:bg-zinc-100 dark:hover:bg-boxdark text-xs cursor-pointer"
                            onClick={() => {
                              handleAddUser(user);
                            }}
                          >
                            {user.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <CustomInput type="text" label="Titre" className="text-sm" />
          </div>
          <div>
            <CustomInput type="textarea" label="Description"  className="text-sm"/>
          </div>
        </>
      </ModalBody>
      <ModalFooter>
        <button
          className="border text-xs p-2 rounded-md  font-semibold bg-transparent border-transparent hover:bg-zinc-100 dark:hover:bg-boxdark2 "
          type="button"
        >
          Annuler
        </button>
        <button className="border dark:border-boxdark text-xs p-2 rounded-md bg-green-700 hover:opacity-85 text-white font-semibold">
          Créer
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AddTaskPhase;
