import { supa } from "../config/config.js";

// Funktion, um Studiengänge aus Supabase abzurufen und im Dropdown anzuzeigen
async function loadStudiengänge() {
    const { data, error } = await supabase
        .from('Studiengänge') // Ersetze 'deine_tabelle' durch den Namen deiner Supabase-Tabelle
        .select('studiengang');

    if (error) {
        alert('Es ist ein Fehler beim Laden der Studiengänge aufgetreten: ' + error.message);
    } else {
        const studiengangDropdown = document.getElementById('studiengang');

        data.forEach((row) => {
            const option = document.createElement('option');
            option.value = row.studiengang;
            option.textContent = row.studiengang;
            studiengangDropdown.appendChild(option);
        });
    }
}

// Event-Listener für das Formular
document.getElementById('signupForm').addEventListener('submit'), async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const selectedStudiengang = document.getElementById('studiengang').value;
    const password = document.getElementById('password').value;

    // Daten an Supabase senden
    const { data, error } = await supabase
        .from('deine_tabelle') // Ersetze 'deine_tabelle' durch den Namen deiner Supabase-Tabelle
        .upsert([
            {
                name: name,
                email: email,
                studiengang: selectedStudiengang,
                password: password
            }
        ]);

    if (error) {
        alert('Es ist ein Fehler aufgetreten: ' + error.message);
    } else {
        alert(`Glückwunsch, ${name}! Du hast dich erfolgreich angemeldet.`);
        // Hier kannst du die Weiterleitung zur nächsten Seite oder andere Aktionen einfügen.
    }
}
