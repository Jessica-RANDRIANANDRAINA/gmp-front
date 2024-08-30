import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import HeaderHierarchy from "../../components/Hierarchy/HeaderHierarchy";
import BodyHierarchy from "../../components/Hierarchy/BodyHierarchy";
import { getAllUsers } from "../../services/User";

const ManageHierarchie = () => {
  const [departChoosen, setDepartChoosen] = useState("");
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      const users = await getAllUsers();
      setUserData(users);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(departChoosen);
  }, [departChoosen]);

  return (
    <DefaultLayout>
      <HeaderHierarchy setDepartChoosen={setDepartChoosen} />
      <BodyHierarchy userData={userData} />
    </DefaultLayout>
  );
};

export default ManageHierarchie;
