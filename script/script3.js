import { supa } from "../config/config.js"; 

// Startbildschirm - Sportart bei seinem User hinzufügen 


// Namen des User oben Links anzeigen 
document.addEventListener('DOMContentLoaded', function() {
  // Überprüfen, ob der Benutzer angemeldet ist (überprüfen Sie, ob der Name im Local Storage vorhanden ist)
  if (localStorage.getItem('loggedInUser')) {
      const userData = JSON.parse(localStorage.getItem('loggedInUser'));
      const username = userData.user_metadata.full_name; // Hier den entsprechenden Pfad für den Benutzernamen in Ihren Benutzerdaten verwenden
      
      // Den Benutzernamen oben links anzeigen
      const usernameElement = document.querySelector('.placeholder-left');
      usernameElement.textContent = username;
  }
});


// Funktion, um Sportarten aus der Supabase-Tabelle abzurufen
async function fetchSportarten() {
    try {
      const { data, error } = await supa.from("Sportarten").select("sportart,sportart_id");
      if (error) {
        console.error("Fehler beim Abrufen der Sportarten:", error);
        return;
      }
      
//Dropdown Menü für Sportarten
const sportartDropdown = document.getElementById("sportart");
    sportartDropdown.innerHTML = '<option value="" disabled selected>Sportart</option>';
    // Studiengänge in das Dropdown-Menü einfügen
    data.forEach((row) => {
      const option = document.createElement("option");
      option.value = row.sportart_id;
      option.textContent = row.sportart;
      sportartDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Sportarten:", error);
  }
}
// nach erfolgreichem auswählen von Sportart, Zeit und Datum in "Sport" auf Supabase Tabelle speichern
async function saveSportSelection() {
  try {
      const sportartDropdown = document.getElementById("sportart");
      const selectedSportId = sportartDropdown.value; // Ausgewählte Sportart-ID

      // Hier müssten Sie entsprechende IDs für die Datums- und Zeitfelder verwenden
      const selectedDate = document.getElementById("selectedDate").value; // Beispiel-ID für das Datumsfeld
      const selectedTime = document.getElementById("selectedTime").value; // Beispiel-ID für das Zeitfeld

      // Speichern der Auswahl in der "Sport" Tabelle der Supabase
      const { data, error } = await supa.from("Sport").insert([
          {
              user_id: 1, // Beispiel-Benutzer-ID, ersetzen Sie dies durch die tatsächliche Benutzer-ID
              sportart_id: selectedSportId,
              datum: selectedDate,
              zeit: selectedTime
          }
      ]);

      if (error) {
          console.error("Fehler beim Speichern der Sportauswahl:", error);
          return;
      }

      console.log("Sportauswahl erfolgreich gespeichert:", data);
  } catch (error) {
      console.error("Fehler beim Speichern der Sportauswahl:", error);
  }
}



// Rufe die Funktion auf, um Sportarten zu laden
fetchSportarten();
