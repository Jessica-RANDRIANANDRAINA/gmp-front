import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { getPhaseById, getTaskByProjectAndPhaseID } from "../../services/Project";
import UpdateTask from "../../components/Modals/Task/UpdateTask";
import ProjectLayout from "../../layout/ProjectLayout";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateTaskPageWrapper = () => {
  const { projectId, phaseId, taskId } = useParams();
  const [taskData, setTaskData] = useState<any>(null);
  const [phaseData, setPhaseData] = useState<any>(null);
  const [, setIsRefreshTaskNeeded] = useState(false);
  const [, setModalUpdateOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId || !phaseId || !taskId) return;

        const tasks = await getTaskByProjectAndPhaseID(projectId, phaseId);
        const found = tasks.find(
          (t: any) =>
            t.id?.toString() === taskId?.toString() ||
            t.taskId?.toString() === taskId?.toString()
        );

        if (!found) {
          notyf.error("Tâche introuvable.");
          return;
        }

        const formatted = {
          id: found.id || found.taskId,
          content: {
            id: found.id || found.taskId,
            title: found.title,
            description: found.description,
            priority: found.priority,
            startDate: found.startDate,
            dueDate: found.dueDate,
            fichier: found.fichier,
            userTasks: found.userTasks,
            status: found.status,
            dailyEffort: found.dailyEffort,
            userName: found.userTasks?.[0]?.name,
            user: [
              {
                user: { name: found.userTasks?.[0]?.name },
                userid: found.userTasks?.[0]?.userid,
              },
            ],
          },
        };

        setTaskData(formatted);
        const phase = await getPhaseById(phaseId);
        setPhaseData(phase);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        notyf.error("Impossible de charger la tâche.");
      }
    };

    fetchData();
  }, [projectId, phaseId, taskId]);

  if (!taskData || !phaseData) {
    return <div className="p-10 text-center text-gray-400">Chargement...</div>;
  }
  return (
    <ProjectLayout>
        <div className="text-sm mx-2 p-4 md:mx-5">
            <div className={`w-full mb-2 flex text-base items-center`}>
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              {name: "Détails", to:`/gmp/project/details/${projectId}/details`},
              {name: "Tâches", to: `/gmp/project/task/${projectId}/${phaseId}` },
              { name: "Modification tâche" },
            ]}
          />
        </div>
            <div className="bg-white dark:bg-boxdark pt-4 pb-3 px-10 shadow-sm">
                <UpdateTask
                task={taskData}
                phaseData={phaseData}
                projectId={projectId}       // ✅ ajouté
                phaseId={phaseId}           // ✅ ajouté
                setModalUpdateOpen={setModalUpdateOpen}
                setIsRefreshTaskNeeded={setIsRefreshTaskNeeded}
                />
            </div>
        </div>
    </ProjectLayout>
  );
};

export default UpdateTaskPageWrapper;
