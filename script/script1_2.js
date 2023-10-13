import { supa } from "../config/config.js";


//ANMELDUNG - STUDIENGANG
// Funktion, um Studiengänge aus der Supabase-Tabelle abzurufen
async function fetchStudiengänge() {
  try {
    const { data, error } = await supa.from("Studiengänge").select("studiengang");
    if (error) {
      console.error("Fehler beim Abrufen der Studiengänge:", error);
      return;
    }
    // Dropdown-Menü erstellen
    const studiengangDropdown = document.getElementById("studiengang");
    studiengangDropdown.innerHTML = '<option value="" disabled selected>Wähle deinen Studiengang</option>';
    // Studiengänge in das Dropdown-Menü einfügen
    data.forEach((row) => {
      const option = document.createElement("option");
      option.value = row.studiengang;
      option.textContent = row.studiengang;
      studiengangDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Studiengänge:", error);
  }
}
// Rufe die Funktion auf, um Studiengänge zu laden
fetchStudiengänge();
