export function formatDate(
  sqlDate: string | number | Date,
  time: boolean = false
) {
  // if the date from db is null or undefined return --
  if (!sqlDate) {
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
