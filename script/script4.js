import { supa } from "../config/config.js"; 

//Liste von geleisteten Sportarten und Stunden anzeigen 

// Funktion zum Abrufen und Anzeigen der gespeicherten Sportaktivitäten
async function fetchAndDisplaySportActivities() {
    try {
        const { data, error } = await supa.from("Sport").select("*").order("datum", { ascending: false });

        if (error) {
            console.error("Fehler beim Abrufen der Sportaktivitäten:", error);
            return;
        }

        const sportActivitiesContainer = document.querySelector(".center-container");
        sportActivitiesContainer.innerHTML = ""; // Leert die vorherige Anzeige

        // Anzeige der abgerufenen Sportaktivitäten
        data.forEach((activity) => {
            const activityDiv = document.createElement("div");
            activityDiv.classList.add("sport-activity");
            activityDiv.textContent = `${activity.datum} - Sportart: ${activity.sportart}, Zeit: ${activity.zeit}`;

            sportActivitiesContainer.appendChild(activityDiv);
        });
    } catch (error) {
        console.error("Fehler beim Abrufen und Anzeigen der Sportaktivitäten:", error);
    }
}

// Rufe die Funktion auf, um die Sportaktivitäten anzuzeigen, wenn die Seite geladen wird
document.addEventListener("DOMContentLoaded", fetchAndDisplaySportActivities);
