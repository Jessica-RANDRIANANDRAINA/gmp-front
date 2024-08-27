import { useState, useEffect } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { TableAccess } from "../../components/Tables";
import AddAccessModal from "../../components/Modals/Access/AddAccessModal";
import { getAllHabilitation } from "../../services/User";

const ManageAccess = () => {
  const [isAddModalAccessVisible, setIsModalAccessVisible] = useState(false);
  const [habilitationData, setHabilitationData] = useState([]);

  useEffect(() => {
    const fetchHabilitation = async () => {
      const habilitation = await getAllHabilitation();
      console.log(habilitation);
      setHabilitationData(habilitation);
    };

    fetchHabilitation();
  }, []);
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
        <TableAccess data={habilitationData} />
        {/* ===== MODAL ADD ACCESS START ===== */}
        {isAddModalAccessVisible && (
          <AddAccessModal
            // accessAdd={isAddModalAccessVisible}
            setAccessAdd={setIsModalAccessVisible}
          />
        )}
        {/* ===== MODAL ADD ACCESS END ===== */}
      </div>
    </DefaultLayout>
  );
};

export default ManageAccess;
