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
              visuel: "3.0.1.1",
              management: "3.0.1.1",
              department: ["DSI"],
            },
            {
              id: "id2",
              label: "client",
              visuel: "1.1.1.0",
              management: "0.0.0.0",
              department: ["DAF"],
            },
            {
              id: "id3",
              label: "manager",
              visuel: "2.2.2.0",
              management: "2.2.1.1",
              department: [
                "DSI",
                "DAF",
                "DCM",
                "DOP",
                "DSI",
                "DAF",
                "DCM",
                "DOP",
                "DSI",
                "DAF",
                "DCM",
                "DOP",
                "DSI",
                "DAF",
                "DCM",
                "DOP",
                "DSI",
                "DAF",
                "DCM",
                "DOP",
              ],
            },
          ]}
        />
      </div>
    </DefaultLayout>
  );
};

export default ManageAccess;
