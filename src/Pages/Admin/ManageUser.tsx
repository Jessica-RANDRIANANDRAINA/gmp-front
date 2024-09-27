import { useEffect, useState } from "react";
import ProjectLayout from "../../layout/ProjectLayout";
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
    <ProjectLayout>
      <div className="mx-2 p-4 md:mx-10">
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
