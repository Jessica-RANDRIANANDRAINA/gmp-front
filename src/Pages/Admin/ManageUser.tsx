import { useEffect, useState } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import { TableUser } from "../../components/Tables";
import { getAllUsers, actualiseUserData } from "../../services/User";
import { getAllMyHabilitation } from "../../services/Function/UserFunctionService";
import { IMyHabilitation } from "../../types/Habilitation";
import { PulseLoader } from "react-spinners";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const ManageUser = () => {
  const [userData, setUserData] = useState([]);
  const [onModification, setOnModification] = useState(false);
  const [loadingActualise, setLoadingActualise] = useState(false);
  const [myHabilitation, setMyHabilitation] = useState<IMyHabilitation>();

  const getHab = async () => {
    const hab = await getAllMyHabilitation();
    setMyHabilitation(hab);
  };

  useEffect(() => {
    getHab();
  }, []);

  const fetchUser = async () => {
    const users = await getAllUsers();
    setUserData(users);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      handleModif();
    }, 300);
  }, [onModification]);

  const handleModif = () => {
    fetchUser();
  };

  const handleActualise = async () => {
    if (!myHabilitation?.admin?.actualizeUserData) {
      return;
    }
    setLoadingActualise(true);
    try {
      await actualiseUserData();
      fetchUser();
      notyf.success("Données actualiser");
    } catch (error) {
      console.error(`Error while actualise data`);
    } finally {
      setLoadingActualise(false);
    }
  };
  return (
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
        <>
          {/* ACTUALIZE START */}
          <div
            className={`w-full mb-2 items-center ${
              myHabilitation?.admin?.actualizeUserData ? "flex" : "hidden"
            }`}
          >
            <button
              type="button"
              className={`md:w-fit gap-2 flex justify-center w-full cursor-pointer mt-2 py-2 lg:px-3 xl:px-2  text-center font-medium text-sm text-white hover:bg-opacity-90  border border-primaryGreen bg-primaryGreen rounded-lg dark:border-darkgreen dark:bg-darkgreen dark:hover:bg-opacity-90  md:ease-in md:duration-300 md:transform  
                   `}
              onClick={handleActualise}
            >
              {loadingActualise ? (
                <div>
                  <PulseLoader size={5} className="mr-2" color={"#fff"} />
                </div>
              ) : (
                <></>
              )}
              Actualiser
            </button>
          </div>
          {/* ACTUALIZE END */}
        </>
        <TableUser
          data={userData}
          setOnModification={setOnModification}
          onModification={onModification}
        />
      </div>
    </ProjectLayout>
  );
};

export default ManageUser;
