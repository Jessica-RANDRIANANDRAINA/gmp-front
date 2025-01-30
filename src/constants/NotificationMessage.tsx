export const getNotificationCreateProject = (
  projectName: string,
  role: "director" | "member" | "observator",
  projectid: string
): JSX.Element => {
  const actions: { [key in "director" | "member" | "observator"]: string } = {
    director: "le gérer",
    member: "voir les détails",
    observator: "suivre son avancement",
  };

  return (
    <>
      Vous avez été ajouté au projet <strong>"{projectName}"</strong> en tant{" "}
      {role === "director" ? (
        <strong>que Chef de projet</strong>
      ) : role === "member" ? (
        <strong>que Membre</strong>
      ) : (
        <strong>qu'Observateur</strong>
      )}
      .{" "}
      <a
        href={` ${
          role === "director"
            ? `${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/update/${projectid}`
            : role === "member"
            ? `${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/details`
            : `${
                import.meta.env.VITE_API_FRONT
              }/gmp/project/details/${projectid}/details`
        }  `}
        className="italic text-xs text-blue-400 hover:text-blue-600"
      >
        Cliquez ici pour {actions[role]}!
      </a>
    </>
  );
};
