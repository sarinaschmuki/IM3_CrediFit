import { supa } from "../config/config.js"; 

// Startbildschirm - Hinzufügen der Sportart für den Benutzer
// DOM Laden 
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Lade die verfügbaren Sportarten
    await fetchSportarten();
    
    // Anzeigen des Namens des Benutzers oben links 
    if (localStorage.getItem('loggedInUser')) {
      const userData = JSON.parse(localStorage.getItem('loggedInUser'));
      getUser(userData.id);
    }
    // Lade die Stunden die der User hat
    await updateSportStunden();
  } catch (error) {
    console.error("Fehler beim Laden der Seite:", error);
  }
});

// Funktion, um alle Daten des Benutzers abzurufen
async function getUser(userID){
  try {
    const { data, error } = await supa.from("User").select().eq("user_id",userID);
    if (error) {
      console.error("Fehler beim Abrufen der Userdaten:", error);
      return;
    }
    const currentUser = data[0].name;
    const usernameElement = document.querySelector('.placeholder-left');
    usernameElement.textContent = currentUser;

} catch (error) {
  console.error("Fehler beim Abrufen der Userdaten:", error);
}
}
 
// Funktion, um den aktuellen Stand der Sportstunden beim Laden der Seite anzeigen
async function updateSportStunden() {
  try {
    // Abrufen der Daten des angemeldeten Benutzers aus dem Local Storage
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    const userID = userData.id;
     // Daten des Benutzers abrufen
    const dataUser = await supa.from("User").select().eq("user_id", userID);
    const currentUserID = dataUser.data[0].primary_id;

    // Alle Einträge des aktuellen Benutzers aus der "Sport" Tabelle abrufen
    const { data: sportData, error: sportError } = await supa
      .from("Sport")
      .select("time")
      .eq("primary_id", currentUserID);

    if (sportError) {
      console.error("Fehler beim Abrufen der Sportdaten:", sportError);
      return;
    }

     // Berechnen der gesamten Zeit der durchgeführten Sportarten in Minuten
    const totalMinutes = sportData.reduce((acc, entry) => acc + parseInt(entry.time), 0);

    // Den Fortschritt im Ring entsprechend der gesammelten Stunden aktualisieren
    updateRing(totalMinutes);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Sportstunden:", error);
  }
}
// Funktion, um Sportarten aus der Supabase-Tabelle abzurufen
async function fetchSportarten() {
    try {
      const { data, error } = await supa.from("Sportarten").select();
      if (error) {
        console.error("Fehler beim Abrufen der Sportarten:", error);
        return;
      }
  
      // Dropdown-Menü für Sportarten erstellen
      const sportartDropdown = document.getElementById("sportart");
      sportartDropdown.innerHTML = '<option value="" disabled selected>Sportart</option>';
    
      // Sportarten in das Dropdown-Menü einfügen
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
const savebutton = document.querySelector('#saveSportSelection');

savebutton.addEventListener('click', function() {
  saveSportSelection();
});

// Funktion zum Speichern der ausgewählten Sportart in der "Sport" Tabelle
async function saveSportSelection() {
  let currentUserID;

  if (localStorage.getItem('loggedInUser')) {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    const  userID = userData.id;
    const dataUser = await supa.from("User").select().eq("user_id",userID);
    currentUserID = dataUser.data[0].primary_id;
  }

  try {
    const sportartDropdown = document.getElementById("sportart");
    const selectedSportId = sportartDropdown.value; 
     
    const selectedDate = document.getElementById("selectionDate").value; 
    const selectedTime = document.getElementById("selectedTime");
    const selectedTimeIndex = selectedTime.selectedIndex;
    const selectedTimeValue = selectedTime.options[selectedTimeIndex].value;
   

    // Speichern der Auswahl in der "Sport" Tabelle der Supabase
    const { data, error } = await supa.from("Sport").insert([
      {
        primary_id: currentUserID,
        sportart_id: selectedSportId,
        date: selectedDate,
        time: selectedTimeValue
      }
    ]); 

    if (!selectedDate || selectedSportId === '') {
      errorMessage.textContent = "Bitte gib ein Datum an und wähle eine Sportart aus.";
      return;
    } else {
      errorMessage.textContent = ""; // Zurücksetzen der Fehlermeldung, falls zuvor angezeigt
    }

    console.log("Sportauswahl erfolgreich gespeichert:", data);

    // Nachdem die Auswahl gespeichert wurde, die gesamte Zeit aktualisieren
    // Hole alle Einträge für den aktuellen Benutzer aus der "Sport" Tabelle
    const { data: sportData, error: sportError } = await supa
      .from("Sport")
      .select("time")
      .eq("primary_id", currentUserID);

    if (sportError) {
      console.error("Fehler beim Abrufen der Sportdaten:", sportError);
      return;
    }
    
    // Berechnen der gesamten Zeit der geleisteten Sportarten in Minuten
    const totalMinutes = sportData.reduce((acc, entry) => acc + parseInt(entry.time), 0);

    // Aktualisiere den Ring mit dem aktuellen Stand vom Benutzer
    updateRing(totalMinutes);

  } catch (error) {
    console.error("Fehler beim Speichern der Sportauswahl:", error);
  }
}

//Fortschritt im Ring anzeigen 
function updateRing(currentUserMinutes) {
  const currentUserHours = currentUserMinutes / 60;
  const MAX_HOURS = 60; 
  const ringFill = document.getElementById('ring-fill');
  const textHours = document.getElementById('stunden');
  const congratulationMessage = document.querySelector('#congratulation');  
  
  const progress = (currentUserHours / MAX_HOURS) * 377;

  
  ringFill.style.strokeDasharray = `${progress} 377`;
  textHours.textContent = `${currentUserHours} h`;
  
  if (currentUserHours >= 60) { // Wenn der Benutzer 60 Stunden erreicht oder mehr
    ringFill.style.stroke = 'green';
    congratulationMessage.style.display = 'block'; // Meldung anzeigen
  } else {
    ringFill.style.stroke = 'black';
    congratulationMessage.style.display = 'none'; // Meldung ausblenden
  }
}
