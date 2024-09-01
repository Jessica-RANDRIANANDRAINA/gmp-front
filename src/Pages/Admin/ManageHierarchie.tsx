import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import {
  ModifyHierarchy,
  BodyHierarchy,
  HeaderHierarchy,
} from "../../components/Hierarchy";
import { getAllUsers } from "../../services/User";
import { UserInterface } from "../../types/user";



const ManageHierarchie = () => {
  const [departChoosen, setDepartChoosen] = useState("");
  const [userData, setUserData] = useState([]);
  const [isModifyHierarchyOpen, setIsModifyHierarchyOpen] = useState(false);
  const [userToModify, setUserToModify] = useState<UserInterface | null>(null);

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
      {/* <HeaderHierarchy setDepartChoosen={setDepartChoosen} /> */}
      <BodyHierarchy
        userData={userData}
        setIsModifyHierarchyOpen={setIsModifyHierarchyOpen}
        setUserToModify={setUserToModify}
      />
      {isModifyHierarchyOpen && (
        <ModifyHierarchy
          setIsModifyHierarchyOpen={setIsModifyHierarchyOpen}
          userToModify={userToModify}
        />
      )}
    </DefaultLayout>
  );
};

export default ManageHierarchie;
