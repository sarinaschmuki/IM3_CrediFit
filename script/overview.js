import { supa } from "../config/config.js";

document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM wurde vollständig geladen");
    try {
        if (localStorage.getItem('loggedInUser')) {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            const userID = user.id;

            const { data: userData, error: userError } = await supa
                .from("User")
                .select()
                .eq("user_id", userID);

            if (userError) {
                console.error("Fehler beim Abrufen der Benutzerdaten:", userError);
                return;
            }

            if (userData && userData[0]) {
                const currentUserID = userData[0].primary_id;

                // Rufen Sie die Funktion updateSportEntries mit dem aktuellen Benutzer-ID auf
                await updateSportEntries(currentUserID);

                // Setzen Sie den Benutzernamen im Header
                const usernameElement = document.getElementById('username');
                if (usernameElement) {
                    usernameElement.textContent = userData[0].name;
                }
            } else {
                console.error("Benutzerdaten nicht gefunden.");
            }
        } else {
            console.error("Benutzer nicht angemeldet.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Sportaktivitäten:", error);
    }
});

async function updateSportEntries(currentUserID) {
    try {
        const sportEntries = document.getElementById('sportEntries');

        if (sportEntries) {
            sportEntries.innerHTML = '';

            const { data: sportData, error: sportError } = await supa
                .from("Sport")
                .select()
                .eq("primary_id", currentUserID);

            if (sportError) {
                console.error("Fehler beim Abrufen der Sportdaten:", sportError);
                return;
            }

            for (const entry of sportData) {
                // Hier rufst du die Sportart basierend auf entry.sportart_id ab
                const { data: sportartData, error: sportartError } = await supa
                    .from("Sportarten") 
                    .select()
                    .eq("sportart_id", entry.sportart_id);

                if (sportartError) {
                    console.error("Fehler beim Abrufen der Sportart:", sportartError);
                    continue; // Setze die Schleife fort, wenn ein Fehler auftritt
                }

                const sportartName = sportartData && sportartData[0] ? sportartData[0].sportart : "Unbekannte Sportart";

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${sportartName}</span>
                    <span>${entry.date}</span>
                    <span>${entry.time} Minuten</span>
                `;
                sportEntries.appendChild(listItem);
            }
            console.log("updateSportEntries wurde aufgerufen");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Sportaktivitäten:", error);
    }
}
