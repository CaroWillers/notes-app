async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      const file = element.getAttribute("w3-include-html");
      try {
        const response = await fetch(file);
        if (response.ok) {
          const content = await response.text();
          element.innerHTML = content;
        } else {
          element.innerHTML = 'Page not found';
        }
      } catch (error) {
        console.error("Fehler beim Laden des Templates:", error);
      }
    }
  }

let titles = [];
let notes = [];
let dates = []; 

let deletedTitles = [];
let deletedNotes = [];
let deletedDates = [];

let trashStatus = false

function toggleMenu() {
    let menu = document.getElementById('menu');
    menu.classList.toggle('show-overlay-menu');

    if (menu.classList.contains('show-overlay-menu')) {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

function toggleNote() { 
    let toggleButton = document.getElementById('toggleButton');
    let noteContainer = document.getElementById('noteContainer'); 

    if (toggleButton.style.display === "none") {
        toggleButton.style.display = "block";
        noteContainer.style.display = "none";    
    } else {
        toggleButton.style.display = "none";
        noteContainer.style.display = "block";  
    } 
}

function render() {
    let content = document.getElementById('content'); 
    let trashContainer = document.getElementById('trash'); 
    content.innerHTML = '';
    content.innerHTML += ` 
        <div class="newNote">
            <div class="content" class="noteContainer">
                <button id="toggleButton" class="toggleNote" onclick="toggleNote()">Neue Notiz schreiben...</button>
            </div>
            <div id="noteContainer" class="noteContainer" style="display: none;">
                <input class="writeNote" id="newTitle" type="text" placeholder="Titel">  
                <textarea class="writeNote" id="newNote" placeholder="Notiz schreiben..."></textarea>
                <div class="hinzufügen">
                <button id="hinzufügen" class="button" onclick="addNote()">Hinzufügen</button>
            </div>
        </div>
    `;

    for (let i = 0; i < notes.length; i++) {
        let title = titles[i];
        let note = notes[i];
        let currentDate = dates[i];

        content.innerHTML += `
        <div class="noteContainer">
            <div><b>${title}</b></div>   
            <div>${note}</div> 
            <br>
            <span style="font-size: 15px;">erstellt am ${currentDate}</span>
            <div class="hinzufügen"> 
                <button class="button" onclick="deleteNote(${i})"><b></b>Notiz löschen</b></button>
            </div>
        </div>
        `;
    }

    trashContainer.style.display = 'none';
}

function addNote() {
    let newTitle = document.getElementById('newTitle').value;  
    let newNote = document.getElementById('newNote').value;
    let currentDate = getCurrentDate();
    
    if (newTitle === "" || newNote === "") {
        alert("Bitte schreibe zuerst eine Notiz.");
        return false;
    }

    titles.push(newTitle); 
    notes.push(newNote);
    dates.push(currentDate);
   
    save();
    render(); 
}

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
}

function save() {
    let titlesAsText = JSON.stringify(titles);
    let notesAsText = JSON.stringify(notes);
    let datesAsText = JSON.stringify(dates);

    localStorage.setItem('titles', titlesAsText);
    localStorage.setItem('notes', notesAsText);
    localStorage.setItem('dates', datesAsText);
}

function load() {
    let titlesAsText = localStorage.getItem('titles');
    let notesAsText = localStorage.getItem('notes');
    let datesAsText = localStorage.getItem('dates');
    if (titlesAsText && notesAsText && datesAsText) {
        titles = JSON.parse(titlesAsText);
        notes = JSON.parse(notesAsText);
        dates = JSON.parse(datesAsText);
    }
}

function deleteNote(i) { 

    deletedTitles.push(titles[i]); 
    deletedNotes.push(notes[i]);
    deletedDates.push(dates[i]);
    
    titles.splice(i, 1);
    notes.splice(i, 1);
    dates.splice(i, 1);
  
    save();
    saveTrash();
    render();  
}

function saveTrash(){
    let deletedTitlesAsText = JSON.stringify(deletedTitles);
    let deletedNotesAsText = JSON.stringify(deletedNotes);
    let deletedDatesAsText = JSON.stringify(deletedDates);

    localStorage.setItem('deletedTitles', deletedTitlesAsText);
    localStorage.setItem('deletedNotes', deletedNotesAsText);
    localStorage.setItem('deletedDates', deletedDatesAsText);
}

function loadTrash() {
    let deletedTitlesAsText = localStorage.getItem('deletedTitles');
    let deletedNotesAsText = localStorage.getItem('deletedNotes');
    let deletedDatesAsText = localStorage.getItem('deletedDates');

   if (deletedTitlesAsText && deletedNotesAsText && deletedDatesAsText) {
        deletedTitles = JSON.parse(deletedTitlesAsText);
        deletedNotes = JSON.parse(deletedNotesAsText);
        deletedDates = JSON.parse(deletedDatesAsText);
    } 
}

function checkTrashStatus() {
    trashStatus = !trashStatus;

    if (trashStatus == false) {
        render();
    } else {
        renderTrash();
    }
}


function renderTrash() { 
    let trashContainer = document.getElementById('trash'); 
    trashContainer.innerHTML = '';

    for (let i = 0; i < deletedTitles.length; i++) { 
        trashContainer.innerHTML += `
        <div class="noteContainer">
        <div><h3>Deine gelöschte Notiz</h3><br><b>${deletedTitles[i]}</b></div>   
        <div>${deletedNotes[i]}</div> 
        <br>
        <span style="font-size: 15px;">gelöscht am ${deletedDates[i]}</span>
        <div class="hinzufügen"> 
            <button class="button" onclick="deleteNoteForever(${i})">Notiz für immer löschen</button>
        </div>
    </div>
        `;
    }  
}

function showNotes() {

    let content = document.getElementById('content'); 
    let trashContainer = document.getElementById('trash'); 
    let noteContainer = document.getElementById('noteContainer');
   
    content.style.display = 'block'; 
    trashContainer.style.display = 'none'; 
    noteContainer.style.display = 'none';

    render();
}

function showDeletedNotes() {
    let trashContainer = document.getElementById('trash');
    let content = document.getElementById('content');

    content.style.display = 'none';
    trashContainer.style.display = 'block';
    
    renderTrash();
}

function deleteNoteForever(i) { 
 
    deletedTitles.splice(i, 1);
    deletedNotes.splice(i, 1);
    deletedDates.splice(i, 1);
   
    saveTrash();
    renderTrash();  
}