import { supa } from "../config/config.js"; 

// Rufe die Funktion auf, um den aktuellen Stand der Stunden beim Laden der Seite anzuzeigen
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Lade die Sportarten
    await fetchSportarten();
    await updateSportStunden();
    
  } catch (error) {
    console.error("Fehler beim Laden der Seite:", error);
  }
});


// Startbildschirm - Sportart bei seinem User hinzufügen 
// Funktion, um den aktuellen Stand der Sportstunden beim Laden der Seite anzuugen
async function updateSportStunden() {
  try {
    // Holen der Daten des angemeldeten Benutzers
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    const userID = userData.id;
    const dataUser = await supa.from("User").select().eq("user_id", userID);
    const currentUserID = dataUser.data[0].primary_id;

    // Abrufen aller Einträge des aktuellen Benutzers aus der "Sport" Tabelle
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
    console.error("Fehler beim Aktualisieren der Sportstunden:", error);
  }
}

// Rufe die Funktion auf, um den aktuellen Stand der Stunden beim Laden der Seite anzuzeigen
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Lade die Sportarten
    await fetchSportarten();
    
    // Aktualisiere die Sportstunden
    await updateSportStunden();
  } catch (error) {
    console.error("Fehler beim Laden der Seite:", error);
  }
});

// Namen des User oben Links anzeigen 
document.addEventListener('DOMContentLoaded', function() {
  // Überprüfen, ob der Benutzer angemeldet ist (überprüfen Sie, ob der Name im Local Storage vorhanden ist)
  if (localStorage.getItem('loggedInUser')) {
      const userData = JSON.parse(localStorage.getItem('loggedInUser'));
      getUser(userData.id);
  }
});

//Funktion zum alle Daten vom User holen
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

// Funktion, um Sportarten aus der Supabase-Tabelle abzurufen
async function fetchSportarten() {
    try {
      const { data, error } = await supa.from("Sportarten").select();
      if (error) {
        console.error("Fehler beim Abrufen der Sportarten:", error);
        return;
      }

  
//Dropdown Menü für Sportarten
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

async function saveSportSelection() {
  let currentUserID;

  if (localStorage.getItem('loggedInUser')) {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    const  userID = userData.id;
    const dataUser = await supa.from("User").select().eq("user_id",userID);
    currentUserID = dataUser.data[0].primary_id;
    console.log(currentUserID); 
  }

  try {
    const sportartDropdown = document.getElementById("sportart");
    const selectedSportId = sportartDropdown.value; // Ausgewählte Sportart-ID
     
    // Hier müssten Sie entsprechende IDs für die Datums- und Zeitfelder verwenden
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

    if (error) {
      console.error("Fehler beim Speichern der Sportauswahl:", error);
      alert("Bitte gib ein Datum an und wähle eine Sportart aus.")
      return;
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
  const MAX_HOURS = 60; // Beispielwert für maximale Stunden, bitte anpassen
  const ringFill = document.getElementById('ring-fill');
  const textHours = document.getElementById('stunden');
  const congratulationMessage = document.querySelector('#congratulation');  
  
  const progress = (currentUserHours / MAX_HOURS) * 377;

  
  ringFill.style.strokeDasharray = `${progress} 377`;
  textHours.textContent = `${currentUserHours}`;
  
  if (currentUserHours >= 60) { // Wenn der Benutzer 60 Stunden erreicht oder mehr
    ringFill.style.stroke = 'green';
    congratulationMessage.style.display = 'block'; // Meldung anzeigen
  } else {
    ringFill.style.stroke = 'black';
    congratulationMessage.style.display = 'none'; // Meldung ausblenden
  }
}



// Rufe die Funktion auf, um Sportarten zu laden
fetchSportarten();