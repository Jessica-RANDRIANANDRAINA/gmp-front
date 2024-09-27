import { useEffect, useState } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import {
  ModifyHierarchy,
  BodyHierarchy,
  // HeaderHierarchy,
} from "../../components/Hierarchy";
import { getAllUsers } from "../../services/User";
import { UserInterface } from "../../types/user";

const ManageHierarchie = () => {
  const [departChoosen] = useState("");
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
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
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
      </div>
    </ProjectLayout>
  );
};

export default ManageHierarchie;
