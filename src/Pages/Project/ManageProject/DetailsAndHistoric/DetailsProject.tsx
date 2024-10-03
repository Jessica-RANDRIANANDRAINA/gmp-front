import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProjectData } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project/ProjectServices";

const DetailsProject = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState<IProjectData>();

  const fetchProjectData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      setProjectData(project);
    }
  };

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

  useEffect(() => {
    fetchProjectData();
  }, []);
  return (
    <div className="grid md:grid-cols-2 gap-2  ">
      {/* ===== LEFT PART START */}
      <div>
        <div className="space-y-2">
          <h1 className="font-bold  text-zinc-600 text-2xl ">
            Information générale
          </h1>
          <aside className="text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-lg">
                {projectData?.title}
              </span>
            </div>
          </aside>
        </div>
      </div>
      {/* ===== LEFT PART END */}
      {/* ===== RIGHT PART START */}
      <div>DetailsProject</div>
      {/* ===== RIGHT P ART END */}
    </div>
  );
};

export default DetailsProject;
