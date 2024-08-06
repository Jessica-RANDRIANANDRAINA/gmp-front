import DefaultLayout from "../../layout/DefaultLayout";
import TableUser from "../../components/Tables/TableUser";

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
