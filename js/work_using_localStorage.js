const workplace = document.getElementById('Workplace');
const storage = document.getElementById('LocalStorage');
displayData();
// *FUNCTION FOR APP
let newTextArea; // Store text area which text editor point to
let globalDocumentName;
  
// function add document
function addDoc() {
    // Check if already had a text editor. If not open a new text editor.
    if (tinymce.activeEditor == null) {
        // Create a dynamic text area in workplace
        newTextArea = document.createElement('textarea');
        // newSaveButton = document.createElement('button');
        // newSaveButton.setAttribute('class', 'button-icon');
        // newSaveButton.setAttribute('id', 'saveButton');
        // newSaveButton.innerHTML = 'Save <i class="fa-solid fa-floppy-disk"></i>';
        workplace.appendChild(newTextArea);
        //workplace.appendChild(newSaveButton);  
          tinymce.init({
              target: newTextArea,
              statusbar: false,
              //custom_ui_selector: newSaveButton,
              plugins: 'image autolink lists media table',
              toolbar: 'addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents myButton',
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
                    messageBlock.setAttribute('style', 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);' 
                    + 'border: 1px solid black; border-radius: 10px; z-index: 1000000; background-color: #6E85B7; color: #fff; text-align: center');
                    let htmlcode = '<label for="docName">Enter your document name:</label>'
                    + '<br>'
                    + '<input type="text" id="docName" name="docName">'
                    + '<br>'
                    // If hit cancel button, remove message and continue to malnipulate with text editor.
                    + '<button id="cancelBtn" style="background-color: #6E85B7; color: #fff; border: none; margin-top: 5px; margin-right: 10px" onclick=cancelSaving(cancelBtn)>Cancel</button>'
                    // If hit save button, remove message, remove text editor and store data into database.
                    + '<button id="saveBtn" style="background-color: #6E85B7; color: #fff; border: none; margin-top: 5px; margin-left: 10px" onclick=continueSaving(saveBtn,tinymce,docName,newTextArea)>Save</button>';
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
    function continueSaving(saveBtn,tinymce,docName,newTextArea) {
        
        document.body.removeChild(saveBtn.parentNode);
        localStorage.setItem(docName.value, JSON.stringify(tinymce.activeEditor.getContent()));
        displayData();
        tinymce.remove();
        workplace.removeChild(newTextArea);
    }
// function display data

function displayData() {
    while (storage.firstChild) {
        storage.removeChild(storage.firstChild);
    }
    for (let i = 0; i < localStorage.length; i++) { 
      const storageItem = document.createElement('div');
        storageItem.setAttribute('style', 'display: flex; justify-content: center; background-color: #6E85B7; border-radius: 10px; margin-bottom: 1%'); 
      
      const documentName = document.createElement('p');
        documentName.setAttribute('style', 'color: #fff; text-decoration: underline; margin-left: 10%');
        documentName.textContent = localStorage.key(i);
        documentName.addEventListener('click', peekDoc);
      storageItem.appendChild(documentName);
      storageItem.setAttribute('data-document-name', localStorage.key(i));

      const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.setAttribute('class', 'button-icon');
        editButton.setAttribute('style', 'margin-left: auto; margin-right: 5%');
        editButton.addEventListener('click', editDoc);

      storageItem.appendChild(editButton);

      const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.setAttribute('class', 'button-icon');
        deleteButton.setAttribute('style', 'margin-right: 10%');
        deleteButton.addEventListener('click', deleteDoc);

      storageItem.appendChild(deleteButton);
      
      storage.appendChild(storageItem);  
    }
}
    // Support function
    function peekDoc(e) {
      const documentName = e.target.parentNode.getAttribute('data-document-name');
      console.log(documentName);
    }
function deleteDoc(e) {
  const documentName = e.target.parentNode.parentNode.getAttribute('data-document-name');
  let messageBlock = document.createElement('div');
  messageBlock.setAttribute('style', 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);' 
  + 'border: 1px solid black; border-radius: 10px; z-index: 1000000; background-color: #6E85B7; color: #fff; text-align: center');
  let title = document.createElement('p');
  title.textContent = "Are you sure delete this document?";
  messageBlock.appendChild(title);


  let deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('style', 'background-color: #6E85B7; color: #fff; border: none; margin-right: 10px');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('id', 'deleteBtn');
  deleteBtn.setAttribute('onclick', 'continueDeleting(deleteBtn,"' + documentName + '")')
  messageBlock.appendChild(deleteBtn);
  let cancelBtn = document.createElement('button');
  cancelBtn.setAttribute('style', 'background-color: #6E85B7; color: #fff; border: none; margin-right: 10px; margin-left: 10px');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.setAttribute('id', 'cancelBtn');
  cancelBtn.setAttribute('onclick', 'cancelDeleting(cancelBtn)');
  messageBlock.appendChild(cancelBtn);
  document.body.appendChild(messageBlock); 
}
    // Support function
    function cancelDeleting(cancelBtn) {
      document.body.removeChild(cancelBtn.parentNode);
    }
    function continueDeleting(deleteBtn, documentName) {
      document.body.removeChild(deleteBtn.parentNode);
        localStorage.removeItem(documentName);
        displayData();      
    }

function editDoc(e) {
    const documentName = e.target.parentNode.parentNode.getAttribute('data-document-name');
    console.log(documentName);
    globalDocumentName = documentName;
    if (globalDocumentName != null) {
      if (tinymce.activeEditor == null) {
      // Create a dynamic text area in workplace
      newTextArea = document.createElement('textarea');
      workplace.appendChild(newTextArea);  
        tinymce.init({
            target: newTextArea,
            statusbar: false,
            plugins: 'image autolink lists media table',
            toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents myButton',
            toolbar_mode: 'floating',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            setup: function(editor) {
              editor.on('init', function (e) {
                editor.setContent(JSON.parse(localStorage.getItem(documentName)));
              });
              editor.ui.registry.addButton('myButton', {
                text: "Save",
                onAction: function(_) { 
                  savingEdition(tinymce, newTextArea, globalDocumentName);
                }
              });

            }
          });
      } 
    }
}
    // Support function
    function savingEdition(tinymce, newTextArea, globalDocumentName) {
      localStorage.setItem(globalDocumentName, JSON.stringify(tinymce.activeEditor.getContent()));
      displayData();
      tinymce.remove();
      workplace.removeChild(newTextArea);
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