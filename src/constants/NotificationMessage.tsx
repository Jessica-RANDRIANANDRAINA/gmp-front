const getNotificationCreateProject = (
  projectName: string,
  role: "director" | "member" | "observator"
): string => {
  const actions: { [key in "director" | "member" | "observator"]: string } = {
    director: "le gérer",
    member: "voir les détails",
    observator: "suivre son avancement",
  };

  return `Vous avez été ajouté au projet '${projectName}' en tant ${
    role === "director"
      ? "que chef de projet"
      : role === "member"
      ? "que membre"
      : "qu'observateur"
  }.  Cliquez ici pour ${actions[role]}!`;
};
