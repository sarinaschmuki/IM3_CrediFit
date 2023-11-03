import { supa } from "../config/config.js"; 

// Startbildschirm - Sportart bei seinem User hinzufügen 


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
  if (localStorage.getItem('loggedInUser')) {
    const userData = JSON.parse(localStorage.getItem('loggedInUser'));
    const  userID = userData.id;
    const dataUser = await supa.from("User").select().eq("user_id",userID);


const currentUserID = dataUser.data[0].primary_id;
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
          return;
      }

      console.log("Sportauswahl erfolgreich gespeichert:", data);
   
  } catch (error) {
      console.error("Fehler beim Speichern der Sportauswahl:", error);
  } 
  
}



// Rufe die Funktion auf, um Sportarten zu laden
fetchSportarten();
