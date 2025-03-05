import { useEffect, useState } from "react";
import GanttChart from "../../components/chart/GanttChart";
import { getAllProject } from "../../services/Project";
import ProjectLayout from "../../layout/ProjectLayout";

const GanttView = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchProject = async () => {
    const fetchedProject = await getAllProject(1, 50);

    // Applatir les données du projet et des phases
    const project = fetchedProject?.project?.flatMap((pr: any) => [
      {
        id: pr.id,
        text: pr.title,
        start_date: new Date(pr.startDate),
        end_date:
          pr.endDate === null ? new Date(pr.startDate) : new Date(pr.endDate),
        progress: pr.completionPercentage / 100,
      },
      // Ajouter les phases comme objets séparés avec un champ 'parent'
      ...pr.listPhases.map((phase: any) => ({
        id: phase.id,
        text: phase.phase1, // phase name
        start_date:
          phase.startDate === null
            ? new Date(pr.startDate)
            : new Date(phase.startDate),
        // end_date: phase.endDate ? new Date(phase.endDate) : undefined,
        end_date:
          phase.endDate === null
            ? new Date(phase.startDate)
            : new Date(phase.endDate),
        parent: pr.id,
        progress: phase.status === "Terminé" ? 1 : 0,
      })),
    ]);

    const sortedProject = project.sort(
      (a: { start_date: number }, b: { start_date: number }) =>
        a.start_date - b.start_date
    );

    setTasks(sortedProject || []);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <ProjectLayout>
      <div className="p-10 min-h-230 ">
        <h1 className="text-2xl font-bold mb-4">Chronogramme des Projets</h1>
        <GanttChart tasks={tasks} />
      </div>
    </ProjectLayout>
  );
};

export default GanttView;
