import { useEffect, useState } from "react";
import GanttChart from "../../components/chart/GanttChart";
import { getAllProject } from "../../services/Project";
import ProjectLayout from "../../layout/ProjectLayout";

const GanttView = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchProject = async () => {
    const fetchedProject = await getAllProject(1, 50);
    const project = fetchedProject?.project?.map((pr: any) => {
      const startDate = new Date(pr.startDate);
      const endDate = pr.endDate ? new Date(pr.endDate) : new Date();

      return {
        id: pr.id,
        text: pr.title,
        start_date: startDate.toLocaleString("fr-FR"),
        end_date: pr.endDate ? endDate.toLocaleDateString("fr-FR") : undefined,
        progress: pr.completionPercentage,
      };
    });
    setTasks(project);
  };

  useEffect(() => {
    fetchProject();
    // const fetchTasks = async () => {
    //   const fetchedTasks = [
    //     {
    //       id: 1,
    //       text: "Gestion de projet GMP",
    //       start_date: "01-03-2025",
    //       duration: 10,
    //       progress: 100,
    //     },
    //     {
    //       id: 2,
    //       text: "Projet B",
    //       start_date: "02-04-2025",
    //       end_date: "30-10-2025",
    //       duration: 15,
    //       progress: 50,
    //     },
    //     {
    //       id: 3,
    //       text: "Projet C",
    //       start_date: "03-03-2025",
    //       end_date: "13-03-2025",
    //       duration: 12,
    //       progress: 75,
    //     },
    //   ];
    //   setTasks(fetchedTasks); // Mettre à jour les données
    // };

    // fetchTasks();
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
