import { supa } from "../config/config.js";

 // Holen der Daten des angemeldeten Benutzers
 const userData = JSON.parse(localStorage.getItem('loggedInUser'));
 const userID = userData.id;
 const dataUser = await supa.from("User").select().eq("user_id", userID);
 const currentUserID = dataUser.data[0].primary_id;

 
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const sportEntries = document.getElementById('sportEntries');
        sportEntries.innerHTML = '';

        if (localStorage.getItem('loggedInUser')) {
            const userData = JSON.parse(localStorage.getItem('loggedInUser'));
            const userID = userData.id;

            const { data: sportData, error: sportError } = await supa
                .from("Sport")
                .select()
                .eq("primary_id", currentUserID);

            if (sportError) {
                console.error("Fehler beim Abrufen der Sportdaten:", sportError);
                return;
            }

            sportData.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `Datum: ${entry.date}, Zeit: ${entry.time} Minuten`;
                sportEntries.appendChild(listItem);
            });
        } else {
            console.error("Benutzer nicht angemeldet oder Benutzerdaten nicht gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Sportaktivitäten:", error);
    }
});
