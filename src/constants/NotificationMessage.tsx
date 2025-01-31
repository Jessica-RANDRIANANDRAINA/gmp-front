export const getNotificationCreateProject = (
  projectName: string,
  role: "director" | "member" | "observator",
  projectid: string,
  type: "Create" | "Update" | "Delete" | "Add",
  table: string,
  subTable: string,
  oldValue: string,
  newValue: string
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
      }
      if (table === "Project" && subTable === "Advancement") {
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
