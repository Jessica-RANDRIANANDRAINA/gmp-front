export const getInitials = (fullname: string) => {
  const names = fullname.split(" ");
  const firstInitial = names?.[0] ? names?.[0]?.[0]?.toUpperCase() : "";
  const secondInitial = names?.[1] ? names?.[1]?.[0]?.toUpperCase() : "";

  return `${firstInitial}${secondInitial}`;
};
