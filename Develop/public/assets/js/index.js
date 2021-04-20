var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// WorkingNote is used to keep track of the notes
var workingNote = {};

// A function for getting all notes from the database
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

// A function saving notes to database
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// A function to delete notes
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

var editNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "PUT"
  })
};

// If there is an workingNote, display it, otherwise render empty inputs
var renderWorkingNote = function() {
  console.log("")
  // $saveNoteBtn.hide();

  if (workingNote.id) {
    // $noteTitle.attr("readonly", true);
    // $noteText.attr("readonly", true);
    $noteTitle.val(workingNote.title);
    $noteText.val(workingNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderWorkingNote();
  });
};

var handleEdit = function (event) {
  event.stopPropagation();
  handleNoteView();
  console.log("got here")
  var note = $(this)
    .parent(".list-group-item")
    .data();

    if (workingNote.id === note.id) {
      workingNote = {
        title: $noteTitle.val(),
        text: $noteText.val()
      };
    }
  editNote(note.id).then(function() {
    saveNote(workingNote);
    getAndRenderNotes();
    renderWorkingNote();
  })
    console.log(note)
}

// Delete the clicked note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (workingNote.id === note.id) {
    workingNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderWorkingNote();
  });
};

// Sets the workingNote and displays it
var handleNoteView = function() {
  console.log("isplaying it")
  workingNote = $(this).data();
  renderWorkingNote();
};

// Sets the workingNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  workingNote = {};
  renderWorkingNote();
};

// Hides save button unlesss text is used
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );
    var $editBtn = $(
      "<i class='penStyle fas fa-pen text-light edit-note float-right'>"
    );

    $li.append($span, $delBtn, $editBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// Gets notes from the database and puts them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".edit-note", handleEdit);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();
