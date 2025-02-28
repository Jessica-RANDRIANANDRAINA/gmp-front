export function formatDate(
  sqlDate: string | number | Date,
  time: boolean = false,
  tail: boolean = true
) {
  // if the date from db is null or undefined return --
  if (!sqlDate && !tail) {
    return "";
  }
  if (!sqlDate && tail) {
    return "--";
  }
  // convert into js date
  const dateObj = new Date(sqlDate);

  // get the day, month and year
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Les mois sont de 0 à 11
  const year = dateObj.getFullYear();

  let formatedDate = `${day}/${month}/${year}`;

  if (time) {
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    formatedDate += ` ${hours}:${minutes}`;
  }

  // return with the desired format
  return formatedDate;
}

export const formatDateToText: any = (sqlDate: string | number | Date) => {
  // Vérification si la date est valide
  if (!sqlDate) {
    return "--";
  }

  const dateObj = new Date(sqlDate);

  // Vérification si la date est valide
  if (isNaN(dateObj.getTime())) {
    return "--"; // Si la date n'est pas valide, on retourne "--"
  }

  // Options pour afficher le jour de la semaine, le jour, le mois et l'année
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Jour de la semaine (ex: Lundi, Mardi)
    day: "2-digit", // Jour avec 2 chiffres (ex: 06)
    month: "long", // Mois avec son nom complet (ex: janvier, février)
    year: "numeric", // Année avec 4 chiffres
  };

  // Format de la date avec le jour, mois, année, etc.
  const formattedDate = dateObj.toLocaleDateString("fr-FR", options);

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return capitalizedDate; // Retourne la date formatée
};

export const getMondayAndFriday = () => {
  const today = new Date();
  const day = today.getDay();

  const monday = new Date(today);
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    monday: monday.toISOString().split("T")[0],
    friday: friday.toISOString().split("T")[0],
  };
};
