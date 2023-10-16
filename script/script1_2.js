import { supa } from "../config/config.js";

//ANMELDUNG 

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
// Event-Listener für das Formular hinzufügen
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const studiengang = document.getElementById("studiengang").value;

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Fehler bei der Registrierung:", error.message);
      return;
    }

    // Weiterleitung auf Screen3
    window.location.href = "screen3.html";
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error.message);
  }
});
// Rufe die Funktion auf, um Studiengänge zu laden
fetchStudiengänge();
