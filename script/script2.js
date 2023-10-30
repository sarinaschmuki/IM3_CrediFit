import { supa } from "../config/config.js";

// Registrierung bei Credifit 

// Funktion, um Studiengänge aus der Supabase-Tabelle abzurufen
async function fetchStudiengänge() {
  try {
    const { data, error } = await supa.from("Studiengänge").select("studiengang,study_id");
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
      option.value = row.study_id;
      option.textContent = row.studiengang;
      studiengangDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Studiengänge:", error);
  }
}
// Registrierung - Event-Listener für das Formular hinzufügen
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const studiengang = document.getElementById("studiengang").value;

    const { user, error } = await supa.auth.signUp({
      email,
      password,
    });
  //console.log(user)
  //console.log(studiengang)
    if (error) {
      console.error("Fehler bei der Registrierung:", error.message);
      return;
    }
// Nach erfolreicher Registrierung Benutzerdaten in "User" Tabelle speichern
const { data, error: insertError } = await supa.from("User").insert([
  {
    user_id:user.id,
    name,
    study_id:parseInt(studiengang)
  },
]);

if (insertError) {
  console.error("Fehler beim Speichern der Benutzerdaten:", insertError);
  return;
}

    // Weiterleitung auf Screen3
    window.location.href = "screen3.html";
});
// Rufe die Funktion auf, um Studiengänge zu laden
fetchStudiengänge();
