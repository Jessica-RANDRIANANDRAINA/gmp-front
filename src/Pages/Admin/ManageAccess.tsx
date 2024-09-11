import { useState, useEffect } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { TableAccess } from "../../components/Tables";
import {
  AddAccessModal,
  UpdateAccessModal,
  ConfirmSuppressAccess,
} from "../../components/Modals/Access";
import { getAllHabilitation, getHabilitationById } from "../../services/User";

const ManageAccess = () => {
  const [isAddModalAccessVisible, setIsModalAccessVisible] = useState(false);
  const [isAddModalModifAccessVisible, setIsModalModifAccessVisible] =
    useState(false);
  const [habilitationData, setHabilitationData] = useState([]);
  const [habilitationToModifData, setHabilitationToModifData] = useState([]);
  const [isDeleteAccess, setIsDeleteAccess] = useState(false);
  const [accessSelectedId, setAccessSelectedId] = useState([]);

  const fetchHabilitationById = async () => {
    if (accessSelectedId.length > 0) {
      const habilitation = await getHabilitationById(accessSelectedId?.[0]);
      setHabilitationToModifData(habilitation);
    }
  };

  useEffect(() => {
    if (isAddModalModifAccessVisible) {
      fetchHabilitationById();
    }
  }, [isAddModalModifAccessVisible, accessSelectedId]);

  // fetch all habilitations
  const fetchHabilitation = async () => {
    const habilitation = await getAllHabilitation();
    console.log(habilitation);
    setHabilitationData(habilitation);
  };
  useEffect(() => {
    fetchHabilitation();
  }, []);

  useEffect(() => {
    handleChange();
  }, [isAddModalAccessVisible]);

  const handleChange = () => {
    fetchHabilitation();
  };

  return (
    <DefaultLayout>
      <div>
        {/* ===== ADD ACCESS START ===== */}
        <div className="w-full mb-2 flex justify-end items-center">
          <button
            onClick={() => setIsModalAccessVisible(true)}
            className="md:w-fit gap-2 flex w-full cursor-pointer mt-2 py-4 px-5  text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5 border border-primaryGreen bg-primaryGreen rounded-lg dark:border-secondaryGreen dark:bg-secondaryGreen dark:hover:bg-opacity-90"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M12 6V18"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            Ajouter un accès
          </button>
        </div>
        {/* ===== ADD ACCESS END ===== */}
        <TableAccess
          data={habilitationData}
          setIsDeleteAccess={setIsDeleteAccess}
          setAccessSelectedId={setAccessSelectedId}
          setIsModalModifAccessVisible={setIsModalModifAccessVisible}
        />
        {/* ===== MODAL ADD ACCESS START ===== */}
        {isAddModalAccessVisible && (
          <AddAccessModal
            // accessAdd={isAddModalAccessVisible}
            setAccessAdd={setIsModalAccessVisible}
          />
        )}
        {/* ===== MODAL ADD ACCESS END ===== */}
        {/* ===== MODAL UPDATE ACCESS END ===== */}
        {isAddModalModifAccessVisible && (
          <UpdateAccessModal
            setIsModalOpen={setIsModalModifAccessVisible}
            setHabilitationToModifData={setHabilitationToModifData}
            habilitationToModifData={habilitationToModifData}
            habilitationId={accessSelectedId?.[0]}
          />
        )}
        {/* ===== MODAL UPDATE ACCESS END ===== */}
        {/* ===== MODAL CONFIRM DELETE ACCESS START ===== */}
        {isDeleteAccess && (
          <ConfirmSuppressAccess
            setIsDeleteAccess={setIsDeleteAccess}
            accessSelectedId={accessSelectedId}
          />
        )}
        {/* ===== MODAL CONFIRM DELETE ACCESS END ===== */}
      </div>
    </DefaultLayout>
  );
};

export default ManageAccess;
