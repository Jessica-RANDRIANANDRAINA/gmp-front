import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { TableUser } from "../../components/Tables";
import { getAllUsers } from "../../services/User";

const ManageUser = () => {
  const [userData, setUserData] = useState([]);
  const [onModification, setOnModification] = useState(false);

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
  return (
    <DefaultLayout>
      <div>
        <TableUser
          data={userData}
          setOnModification={setOnModification}
          onModification={onModification}
        />
      </div>
    </DefaultLayout>
  );
};

export default ManageUser;
