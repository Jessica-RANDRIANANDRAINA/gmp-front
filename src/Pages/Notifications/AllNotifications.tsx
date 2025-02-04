import Breadcrumb from "../../components/BreadCrumbs/BreadCrumb";
import ProjectLayout from "../../layout/ProjectLayout";
import { useState } from "react";

const activities = [
  {
    date: "Sunday, 06 March",
    items: [
      {
        id: 1,
        user: "Carolyn Perkins",
        action: "a changé le statut de",
        target: "PD-979",
        status: "Completed",
        time: "18:20",
      },
      {
        id: 2,
        user: "Ron Vargas",
        action: "a commenté votre",
        target: "Post",
        time: "17:53",
        content:
          "Fine, Java MIGHT be a good example of what a programming language should be like. But Java applications are good examples of what applications SHOULDN'T be like.",
      },
      {
        id: 3,
        user: "Joyce Freeman",
        action: "a ajouté des tags",
        tags: ["Live Issue", "Backend"],
        time: "16:40",
      },
    ],
  },
  {
    date: "Saturday, 05 March",
    items: [
      {
        id: 4,
        user: "Frederick Adams",
        action: "a commenté votre",
        target: "Post",
        time: "08:49",
        content:
          "The trouble with programmers is that you can never tell what a programmer is doing until it's too late.",
      },
      {
        id: 5,
        user: "Brittany Hale",
        action: "a changé le statut de",
        target: "PD-977",
        status: "In Dev",
        time: "08:30",
      },
    ],
  },
];

const AllNotifications = () => {
  const [activityData] = useState(activities);

  return (
    <ProjectLayout>
      <div className="mx-4 p-6 md:mx-10 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="w-full mb-6 flex justify-between items-center">
          <Breadcrumb
            paths={[
              { name: "Projets", to: "/gmp/project/list" },
              { name: "Notifications" },
            ]}
          />
        </div>

        {/* Timeline */}
        <div className="space-y-12">
          {activityData.map((activity, index) => (
            <div key={index}>
              {/* Date */}
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-wide">
                {activity.date}
              </h2>

              {/* Liste des événements */}
              <div className="relative border-l border-gray-300 dark:border-gray-700 pl-6">
                {activity.items.map((item) => (
                  <div key={item.id} className="relative mb-8">
                    {/* Cercle élégant pour la timeline */}
                    <div className="absolute -left-3 top-2 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-gray-900 shadow-md"></div>

                    {/* Contenu de l'événement */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                      <p className="text-gray-900 dark:text-gray-200 text-sm font-semibold">
                        {item.user}{" "}
                        <span className="text-gray-700 dark:text-gray-300 font-normal">
                          {item.action}{" "}
                          {item.target && (
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {item.target}
                            </span>
                          )}
                          {item.status && (
                            <span className="text-green-600 dark:text-green-400 font-semibold">
                              {" "}
                              {item.status}
                            </span>
                          )}
                        </span>
                      </p>

                      {/* Affichage des tags ou contenu si présent */}
                      {item.tags && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs rounded-md text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.content && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 italic">
                          "{item.content}"
                        </p>
                      )}

                      {/* Heure */}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProjectLayout>
  );
};

export default AllNotifications;
