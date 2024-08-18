import DefaultLayout from "../../layout/DefaultLayout";
import { TableUser } from "../../components/Tables";

const ManageUser = () => {
  return (
    <DefaultLayout>
      <div>
        <TableUser 
          data={[""]}
        />
      </div>
    </DefaultLayout>
  );
};

export default ManageUser;
