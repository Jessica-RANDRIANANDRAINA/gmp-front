export const getNotificationCreateProject = (
  projectName: string,
  role: "director" | "member" | "observator",
  projectid: string,
  type: "Create" | "Update" | "Delete" | "Add" | "Archive",
  table: string,
  subTable: string,
  newValue: string,
  activityid: string,
  modifiedBy: string
): JSX.Element => {
  const actions: { [key in "director" | "member" | "observator"]: string } = {
    director: "le gérer",
    member: "voir les détails",
    observator: "suivre son avancement",
  };

  // Générer l'URL en fonction du rôle
  const generateUrl = (
    role: "director" | "member" | "observator",
    projectid: string
  ) => {
    const baseUrl = import.meta.env.VITE_API_FRONT + "/gmp/project";
    if (role === "director") {
      return `${baseUrl}/update/${projectid}`;
    } else {
      return `${baseUrl}/details/${projectid}/details`;
    }
  };

  switch (type) {
    case "Create":
      if (table === "Project") {
        return (
          <>
            Vous avez été ajouté au nouveau projet{" "}
            <strong>"{projectName}"</strong> en tant{" "}
            {role === "director" ? (
              <strong>que Chef de projet</strong>
            ) : role === "member" ? (
              <strong>que Membre</strong>
            ) : (
              <strong>qu'Observateur</strong>
            )}
            .{" "}
            <a
              href={generateUrl(role, projectid)}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour {actions[role]}!
            </a>
          </>
        );
      } else if (table === "Activity") {
        if (subTable === "Task") {
          return (
            <>
              La tâche <i><strong>{newValue}</strong></i> vous a été confiée par{" "}
              <strong>{modifiedBy}</strong> sur le projet{" "}
              <strong>{projectName}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        }
      }
      return <></>;

    case "Update":
      if (table === "UserProject") {
        return (
          <>
            Votre rôle dans le projet <strong>{projectName}</strong> a été
            modifié, vous êtes désormais{" "}
            <strong>
              {role === "director"
                ? "Le Chef de projet"
                : role === "observator"
                ? "un Observateur"
                : "un Membre"}
            </strong>
            .{" "}
            <a
              href={`${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/historic`}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour voir l'historique des modifications!
            </a>
          </>
        );
      } else if (table === "Project") {
        if (subTable === "Advancement") {
          const isCompleted = newValue === "100";
          const link = `${
            import.meta.env.VITE_API_FRONT
          }/gmp/project/details/${projectid}/${
            isCompleted ? "details" : "historic"
          }`;
          return (
            <>
              {isCompleted ? (
                <>
                  Le projet '<strong>{projectName}</strong>' a été{" "}
                  <strong>cloturé</strong>🎉 .
                  <a
                    href={link}
                    className="italic text-xs text-blue-400 hover:text-blue-600"
                  >
                    Cliquez ici pour voir les détails.
                  </a>
                </>
              ) : (
                <>
                  L'avancement du projet '<strong>{projectName}</strong>' a été
                  mis à jour.{" "}
                  <a
                    href={link}
                    className="italic text-xs text-blue-400 hover:text-blue-600"
                  >
                    Consulter l'historique des modifications.
                  </a>
                </>
              )}
            </>
          );
        } else if (subTable === "Status") {
          const state =
            newValue === "Stand by" ? "Mis en stand by" : "Débloquer";
          return (
            <>
              Le projet <strong>{projectName}</strong> a été{" "}
              <strong>{state}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/details/${projectid}/details
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        } else if (subTable === "Phase") {
          const projectTitle = projectName.split("/")?.[0];
          const phaseTitle = projectName.split("/")?.[1];
          const state =
            newValue === "Terminé"
              ? "terminée"
              : newValue === "En cours"
              ? "maintenant en cours"
              : "en attente de démarrage";
          return (
            <>
              La phase <strong>{phaseTitle}</strong> du projet{" "}
              <strong>{projectTitle}</strong> est <strong>{state}</strong>.{" "}
              <a
                href={`${
                  import.meta.env.VITE_API_FRONT
                }/gmp/project/task/${projectid}/${activityid}
              `}
                className="italic text-xs text-blue-400 hover:text-blue-600"
              >
                Voir les détails.
              </a>
            </>
          );
        }
      }
      return <></>;

    case "Delete":
      if (table === "UserProject") {
        return (
          <>
            Vous avez été retiré du projet <strong>{projectName}</strong>. Si
            vous avez des questions, contactez le chef de projet.
          </>
        );
      }
      return <></>;
    case "Archive":
      if (table === "Project") {
        return (
          <>
            Le projet <strong>{projectName}</strong> a été archivé.
            <a
              href={`${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/historic
              `}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Consulter l'historique des modifications.
            </a>
          </>
        );
      }
      return <></>;

    case "Add":
      if (table === "UserProject") {
        return (
          <>
            Vous avez été ajouté au projet <strong>"{projectName}"</strong> en
            tant{" "}
            {role === "director" ? (
              <strong>que Chef de projet</strong>
            ) : role === "member" ? (
              <strong>que Membre</strong>
            ) : (
              <strong>qu'Observateur</strong>
            )}
            .{" "}
            <a
              href={generateUrl(role, projectid)}
              className="italic text-xs text-blue-400 hover:text-blue-600"
            >
              Cliquez ici pour {actions[role]}!
            </a>
          </>
        );
      }
      return <></>;

    default:
      return <></>;
  }
};
