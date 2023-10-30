import { supa } from "../config/config.js";

// Anmeldung bei Credifit 


// Anmelde-Event-Listener hinzufügen
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, error } = await supa.auth.signIn({
        email,
        password,
    });

    if (error) {
        console.error("Fehler bei der Anmeldung:", error.message);
        errorContainer.textContent = "Fehler bei der Anmeldung, bitte bestätige die E-Mail Adresse in deinem Postfach und überprüfe das Passwort.";
    } else {
        // Anmeldung erfolgreich, weiterleiten auf Screen3
        window.location.href = "screen3.html";
}
});
