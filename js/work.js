//  SET UP INDEXDATABASE

// Create an instance of a db object to store the open database in
let db;
// Open database
const openRequest = window.indexedDB.open('storage_db', 1);
// error hander signifies that the database didn't open successfully
openRequest.addEventListener('error', () => console.error('Database failed to open'));
// successfully handler signifies that the database opened successfully
openRequest.addEventListener('success', () => {
    console.log('Database opened succesfully');
  
    // Store the opened database object in the db variable. This is used a lot below
    db = openRequest.result;
  
    // Run the displayData() function to display the notes already in the IDB
    displayData();
});
// Set up the database tables if this has not already been done
openRequest.addEventListener('upgradeneeded', (e) => {

    // Grab a reference to the opened database
    db = e.target.result;
  
    // Create an objectStore to store document in (basically like a single table)
    // including a auto-incrementing key
    const objectStore = db.createObjectStore('storage_os', { keyPath: 'id', autoIncrement: true });
  
    // Define what data items the objectStore will contain
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('content', 'content', { unique: false });
  
    console.log('Database setup complete');
  });
  
// ADD FUNCTION FOR APP

const workplace = document.getElementById('Workplace');
const localStorage = document.getElementById('LocalStorage');

// *FUNCTION ADD
let inputName; // This variable store input name
let inputContent; // This variable store input content get from text editor
let newTextArea; // Store text area which text editor point to

function addDoc() {
    // Check if already had a text editor. If not open a new text editor.
    if (tinymce.activeEditor == null) {
    // Create a dynamic text area in workplace
    newTextArea = document.createElement('textarea');
    workplace.appendChild(newTextArea);  
      tinymce.init({
          target: newTextArea,
          plugins: 'a11ychecker advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinycomments tinymcespellchecker',
          toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents myButton',
          toolbar_mode: 'floating',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          setup: function(editor) {
            editor.ui.registry.addButton('myButton', {
              text: "Save",
              onAction: function(_) { 
                // Create a message to get the document name by popup message.
                let messageBlock = document.createElement('div');
                messageBlock.setAttribute('id', 'getName');
                messageBlock.setAttribute('style', 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); border: 1px solid black');
                let htmlcode = '<label for="docName">Enter your document name:</label>'
                + '<br>'
                + '<input type="text" id="docName" name="docName">'
                + '<br>'
                // If hit cancel button, remove message and continue to malnipulate with text editor.
                + '<button id="cancelBtn" onclick=cancelSaving(cancelBtn)>Cancel</button>'
                // If hit save button, remove message, remove text editor and store data into database.
                + '<button id="saveBtn" onclick=continueSaving(saveBtn,inputName,inputContent,tinymce,docName,newTextArea)>OK</button>';
                messageBlock.innerHTML = htmlcode;
                document.body.appendChild(messageBlock);
              }
            });
          }
        });
    }  
  }
      // Support function
      function cancelSaving(cancelBtn) {
        document.body.removeChild(cancelBtn.parentNode);
      }
      function continueSaving(saveBtn,inputName,inputContent,tinymce,docName,newTextArea) {
        // Get input name which user have just type in
        inputName = docName.value;
        // Get input data in text editor
        inputContent = tinymce.activeEditor.getContent();
        document.body.removeChild(saveBtn.parentNode);
        // Create an object to use for add function 
        const newDoc = {name: inputName, content: inputContent};
        // Open objectStore with readwrite mode
        const transaction = db.transaction('storage_os', 'readwrite');
        const objectStore = transaction.objectStore('storage_os');
        // Add object into database
        const addRequest = objectStore.add(newDoc);
        addRequest.addEventListener('success', () => {
          inputName = '';
          inputContent = '';
        });
        transaction.addEventListener('complete', () => {
          console.log('Transaction completed: database modification finished.');
          displayData();
        });
        transaction.addEventListener('error', () => console.log('Transaction not opened due to error'));
        // Remove text editor and textarea that was created before.
        tinymce.remove();
        workplace.removeChild(newTextArea)
      }

// *FUNCTION DISPLAY DATA

function displayData() {
  // Delete all element exist in local storage for new display.
  while (localStorage.firstChild) {
    localStorage.removeChild(localStorage.firstChild);
  }
  // Access to database by cursor.
  const objectStore = db.transaction('storage_os').objectStore('storage_os');
  objectStore.openCursor().addEventListener('success', (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const storageItem = document.createElement('div');
      const documentName = document.createElement('p');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      storageItem.appendChild(documentName);
      storageItem.appendChild(editButton);
      storageItem.appendChild(deleteButton);
      storageItem.setAttribute('style', 'display: flex; background-color: #6E85B7; border-radius: 10px; margin-bottom: 1%');
      localStorage.appendChild(storageItem);
      documentName.textContent = cursor.value.name;
      documentName.setAttribute('style', 'color: #fff');
      editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      editButton.setAttribute('class', 'button-icon');
      deleteButton.setAttribute('class', 'button-icon');
      storageItem.setAttribute('data-document-id', cursor.value.id);
      deleteButton.addEventListener('click', deleteDoc);
      editButton.addEventListener('click', editDoc);
      cursor.continue();
    }
    else {
      if (!localStorage.firstChild) {
        const storageItem = document.createElement('div');
        storageItem.textContent = 'No documents stored.';
        localStorage.appendChild(storageItem);
        console.log('Documents all displayed');
      }
    }
  });
}
// *FUNCTION DELETE
function deleteDoc(e) {
  const documentId = Number(e.target.parentNode.parentNode.getAttribute('data-document-id'));
  const transaction = db.transaction('storage_os', 'readwrite');
  const objectStore = transaction.objectStore('storage_os');
  const deleteRequest = objectStore.delete(documentId);
  transaction.addEventListener('complete', () => {
    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    console.log('Document ' + documentId + ' deleted.');
    if (!localStorage.firstChild) {
      const storageItem = document.createElement('div');
      storageItem.textContent = 'No documents stored.';
      localStorage.appendChild(storageItem);
    }
  });
}
// *FUNCTION EDIT
function editDoc(e) {
  const documentId = Number(e.target.parentNode.parentNode.getAttribute('data-document-id'));
  const transaction = db.transaction('storage_os', 'readonly');   
}

// *FUNCTION FOR CONTACT
function sendMail() {
  let link = "mailto:luuvanducthieu291@gmail.com"
  window.location.href = link;
}

function goToFacebook() {
  window.location.href = "https://www.facebook.com/luu.thieu.9659";
}

function goToLinkedIn() {
  window.location.href = "https://www.linkedin.com/feed/?trk=onboarding-landing";
}



