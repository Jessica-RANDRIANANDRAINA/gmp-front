import React from "react";
import ProjectLayout from "../../layout/ProjectLayout";
import { TableProjet } from "../../components/Tables/projets";

const ManageProjects = () => {
  return (
    <ProjectLayout>
      <div>
        <TableProjet  data={[]} />
      </div>
    </ProjectLayout>
  );
};

export default ManageProjects;
