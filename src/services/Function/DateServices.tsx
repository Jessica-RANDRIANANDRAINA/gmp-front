export function formatDate(sqlDate: string | number | Date) {
    // if the date from db is null or undefined return --
    if (!sqlDate) {
       return '--'
    }
    // convert into js date
    const dateObj = new Date(sqlDate);

    // get the day, month and year
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont de 0 à 11
    const year = dateObj.getFullYear();

    // return with the desired format
    return `${day}/${month}/${year}`;
}