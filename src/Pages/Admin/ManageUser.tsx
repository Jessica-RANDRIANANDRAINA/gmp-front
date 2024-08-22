import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import { TableUser } from "../../components/Tables";
import { getAllUsers } from "../../services/User";

const ManageUser = () => {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const users = await getAllUsers();
      setUserData(users);
    };
    fetchUser();
  }, []);
  return (
    <DefaultLayout>
      <div>
        <TableUser data={userData} />
      </div>
    </DefaultLayout>
  );
};

export default ManageUser;
