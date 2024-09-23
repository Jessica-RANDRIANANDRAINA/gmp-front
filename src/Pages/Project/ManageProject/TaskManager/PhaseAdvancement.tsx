import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomInput } from "../../../../components/UIElements";
import { IProjectData, IPhase } from "../../../../types/Project";
import { getProjectById } from "../../../../services/Project/ProjectServices";

const PhaseAdvancement = () => {
  const { projectId, phaseId } = useParams();
  const [phaseData, setPhaseData] = useState<IPhase>();

  const fetchData = async () => {
    if (projectId) {
      const project = await getProjectById(projectId);
      const phase = project?.listPhases?.filter((ph: IPhase) => {
        return ph.id === phaseId;
      });
      console.log(phase?.[0]);
      setPhaseData(phase?.[0]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [phaseId]);

  return (
    <div className="p-5 space-y-3">
      <div>
        <span className="w-5 h-5 flex justify-center items-center rounded-full border cursor-pointer"> 
          +
        </span>
      </div>
    </div>
  );
};

export default PhaseAdvancement;
