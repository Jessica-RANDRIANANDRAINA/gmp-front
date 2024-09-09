export function formatDate(sqlDate: string | number | Date) {
    // Convertir la chaîne de date SQL Server en objet Date JS
    const dateObj = new Date(sqlDate);

    // Récupérer le jour, le mois et l'année
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont de 0 à 11
    const year = dateObj.getFullYear();

    // Retourner la date formatée
    return `${day}/${month}/${year}`;
}