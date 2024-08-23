import DefaultLayout from "../../layout/DefaultLayout";
import { TableAccess } from "../../components/Tables";

const ManageAccess = () => {
  return (
    <DefaultLayout>
      <div>
        <TableAccess
          data={[
            {
              id: "id1",
              label: "directeur",
              admin: ["create", "update", "delete hierarchie"],
              project: ["create", "update", "delete hierarchie"],
              transverse: ["create", "update", "delete"],
              intercontract: ["create", "update", "delete"],
            },
            {
              id: "id2",
              label: "client",
              admin: [],
              project: ["create", "update", "delete"],
              transverse: [],
              intercontract: ["create", "update", "delete"],
            },
            {
              id: "id3",
              label: "manager",
              admin: [],
              project: ["create", "update", "delete"],
              transverse: ["create", "update"],
              intercontract: ["create", "update", "delete"],
            },
          ]}
        />
      </div>
    </DefaultLayout>
  );
};

export default ManageAccess;
