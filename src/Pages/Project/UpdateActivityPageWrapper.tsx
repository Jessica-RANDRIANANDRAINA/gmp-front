import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectLayout from "../../layout/ProjectLayout";
import UpdateActivity from "../../components/Modals/Activity/UpdateActivity";
import { getAllActivitiesOfUser } from "../../services/Project";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";

const notyf = new Notyf({ position: { x: "center", y: "top" } });

const UpdateActivityPageWrapper = () => {
  const { userid, activityType, activityId } = useParams();
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, setIsRefreshNeeded] = useState<boolean>(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        console.log("✅ URL params :", { userid, activityType, activityId });

        // 📦 Récupération des activités de l’utilisateur courant
        const response = await getAllActivitiesOfUser(undefined, undefined, [], [userid]);
        console.log("📦 Activités récupérées :", response.map((r: any) => r.id));

        // ✅ Nettoyage de l’ID dans l’URL
        const cleanActivityId = String(activityId).split(".")[0];

        // 🧩 Fonction de normalisation (évite problèmes d’espaces/casse)
        const normalize = (val: any) =>
          String(val).toLowerCase().replace(/\s+/g, "").trim();

        // 🔍 Recherche de l’activité correspondante
        const found = response.find((a: any) => {
          const idA = normalize(a.id);
          const idB = normalize(cleanActivityId);
          return idA === idB || idA.startsWith(idB) || idB.startsWith(idA);
        });

        if (found) {
          console.log("✅ Activité trouvée :", found);

          setActivity({
            id: found.id,
            content: {
              id: found.id,
              title: found.title,
              description: found.description,
              status: found.status,
              startDate: found.startDate,
              endDate: found.endDate,
              fichier: found.fichier,
              dailyEffort: found.dailyEffort,
              finished: found.finished,
              type: found.type,
              subType: found.subType,
              projectId: found.projectid,
              phaseId: found.phaseid,
              priority: found.priority,
              userid: found.userid,
              userName: found.userName,
              user: [
                { user: { name: found.userName || "—" }, userid: found.userid },
              ],
            },
          });
        } else {
          console.warn("❌ Aucune activité trouvée pour", cleanActivityId);
          notyf.error("Activité introuvable !");
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
        notyf.error("Erreur lors du chargement de l’activité");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [userid, activityId]);

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex justify-center items-center h-screen text-gray-500">
          Chargement de l’activité...
        </div>
      </ProjectLayout>
    );
  }

  if (!activity) {
    return (
      <ProjectLayout>
        <div className="flex justify-center items-center h-screen text-red-500">
          Activité introuvable ou supprimée.
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
        <div className="text-sm mx-2 p-4 md:mx-5">
             <div className={`w-full mb-2 flex text-base items-center`}>
          <Breadcrumb
            paths={[
              { name: "Tâches", to: `/gmp/activity/${userid}` },
              { name: "Modification tâche" },
            ]}
          />
        </div>
            <div className="bg-white dark:bg-boxdark pt-4 pb-3 px-10 shadow-sm">
            <UpdateActivity
                activity={activity}
                setModalUpdateOpen={() => {}}
                setIsRefreshNeeded={setIsRefreshNeeded}
            />
            </div>
      </div>
    </ProjectLayout>
  );
};

export default UpdateActivityPageWrapper;
