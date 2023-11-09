import { supa } from "../config/config.js";

// Laden des DOM-Inhalts und Initialisierung
document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM wurde vollständig geladen");
    // Überprüfen, ob ein Benutzer angemeldet ist
    try {
        if (localStorage.getItem('loggedInUser')) {
            // Benutzerdaten aus dem lokalen Speicher abrufen
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            const userID = user.id;

             // Benutzerdaten aus der Datenbank abrufen
            const { data: userData, error: userError } = await supa
                .from("User")
                .select()
                .eq("user_id", userID);

            if (userError) {
                console.error("Fehler beim Abrufen der Benutzerdaten:", userError);
                return;
            }
              // Wenn Benutzerdaten vorhanden sind
            if (userData && userData[0]) {
                 // ID des angemeldeten Benutzers abrufen
                const currentUserID = userData[0].primary_id;
                
                // Aktualisiere die Sporteinträge des aktuellen Benutzers
                await updateSportEntries(currentUserID);

               // Setze den Benutzernamen im Header
                const usernameElement = document.getElementById('username');
                if (usernameElement) {
                    usernameElement.textContent = userData[0].name;
                }
                // Event-Listener für den Button zum Löschen aller Einträge hinzufügen
                const deleteButton = document.getElementById('deleteAllEntriesButton'); // ID des Buttons anpassen
                deleteButton.addEventListener('click', deleteAllSportEntries); // Event-Listener für den Button hinzufügen
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

// Funktion zum Aktualisieren der Sporteinträge auf der Seite
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
            // Durchlaufen der abgerufenen Sportdaten und Anzeige auf der Seite
            for (const entry of sportData) {
                 // Abrufen der Sportart basierend auf der sportart_id
                const { data: sportartData, error: sportartError } = await supa
                    .from("Sportarten") 
                    .select()
                    .eq("sportart_id", entry.sportart_id);

                if (sportartError) {
                    console.error("Fehler beim Abrufen der Sportart:", sportartError);
                    continue; // Setze die Schleife fort, wenn ein Fehler auftritt
                }
                // Erstellen und Anzeigen des Eintrags
                const sportartName = sportartData && sportartData[0] ? sportartData[0].sportart : "Unbekannte Sportart";
                const listItem = document.createElement('li');
                listItem.classList.add('sport-entry'); 
                listItem.innerHTML = `
                    <span class="sport">${sportartName}</span>
                    <span class="date">${entry.date}</span>
                    <span class="duration">${entry.time} Minuten</span>
                `;
                sportEntries.appendChild(listItem);
            }
            console.log("updateSportEntries wurde aufgerufen");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Sportaktivitäten:", error);
    }
}
// Funktion zum Löschen aller Sporteinträge des aktuellen Benutzers
async function deleteAllSportEntries() {
    try {
        // Abrufen des aktuellen Benutzers
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const userID = user.id;
        // Abrufen der Benutzerdaten aus der Datenbank
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

            // Löschen aller Einträge in der "Sport"-Tabelle für den aktuellen Benutzer
            await supa
                .from("Sport")
                .delete()
                .eq("primary_id", currentUserID);

            console.log("Alle Sporteinträge des aktuellen Benutzers wurden gelöscht.");

            // Nach dem Löschen die Sporteinträge erneut aktualisieren
        await updateSportEntries(currentUserID);
        } else {
         console.error("Benutzerdaten nicht gefunden.");
        }
     } catch (error) {
     console.error("Fehler beim Löschen der Sportaktivitäten:", error);
 }
 }
