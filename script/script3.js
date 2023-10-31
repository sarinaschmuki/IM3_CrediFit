import { supa } from "../config/config.js"; 

// Startbildschirm - Sportart bei seinem User hinzufügen 

// Namen des User oben Links anzeigen 



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




// Rufe die Funktion auf, um Sportarten zu laden
fetchSportarten();
