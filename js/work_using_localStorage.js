const workplace = document.getElementById('Workplace');
const storage = document.getElementById('LocalStorage');
displayData();
// *FUNCTION FOR APP
let inputName; // This variable store input name
let inputContent; // This variable store input content get from text editor
let newTextArea; // Store text area which text editor point to
let globaldocumentName;
// function add document
function addDoc() {
    // Check if already had a text editor. If not open a new text editor.
    if (tinymce.activeEditor == null) {
        // Create a dynamic text area in workplace
        newTextArea = document.createElement('textarea');
        workplace.appendChild(newTextArea);  
          tinymce.init({
              target: newTextArea,
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
                    + '<button id="saveBtn" style="background-color: #6E85B7; color: #fff; border: none; margin-top: 5px; margin-left: 10px" onclick=continueSaving(saveBtn,inputName,inputContent,tinymce,docName,newTextArea)>OK</button>';
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
        
        localStorage.setItem(inputName, JSON.stringify(inputContent));
        console.log("Save successfully");
        displayData();
        tinymce.remove();
        workplace.removeChild(newTextArea);
      }
// function display data

function displayData() {
    while (storage.firstChild) {
        storage.removeChild(storage.firstChild);
      }
    console.log(localStorage.length);
    for (let i = 0; i < localStorage.length; i++) {
      const storageItem = document.createElement('div');
      const documentName = document.createElement('p');
      const editButton = document.createElement('button');
      const deleteButton = document.createElement('button');
      storageItem.appendChild(documentName);
      storageItem.appendChild(editButton);
      storageItem.appendChild(deleteButton);
      storageItem.setAttribute('style', 'display: flex; justify-content: center; background-color: #6E85B7; border-radius: 10px; margin-bottom: 1%');
      storage.appendChild(storageItem);
      documentName.textContent = localStorage.key(i);
      documentName.setAttribute('style', 'color: #fff; text-decoration: underline; margin-left: 10%');
      editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      editButton.setAttribute('class', 'button-icon');
      editButton.setAttribute('style', 'margin-left: auto; margin-right: 5%');
      deleteButton.setAttribute('class', 'button-icon');
      deleteButton.setAttribute('style', 'margin-right: 10%');
      storageItem.setAttribute('data-document-name', localStorage.key(i));
      deleteButton.addEventListener('click', deleteDoc);
      editButton.addEventListener('click', editDoc);
    }
}
  // Support function

  function deleteDoc(e) {
    const documentName = e.target.parentNode.parentNode.getAttribute('data-document-name');
    localStorage.removeItem(documentName);
    displayData();
  }

  function editDoc(e) {
    const documentName = e.target.parentNode.parentNode.getAttribute('data-document-name');
    globaldocumentName = documentName;
    if (tinymce.activeEditor == null) {
      // Create a dynamic text area in workplace
      newTextArea = document.createElement('textarea');
      workplace.appendChild(newTextArea);  
        tinymce.init({
            target: newTextArea,
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
                  // Create a message to get the document name by popup message.
                  let messageBlock = document.createElement('div');
                  messageBlock.setAttribute('id', 'getName');
                  messageBlock.setAttribute('z-index', '1000');
                  messageBlock.setAttribute('style', 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);' 
                  + 'border: 1px solid black; border-radius: 10px; z-index: 1000000; background-color: #6E85B7; color: #fff; text-align: center');
                  let htmlcode = '<label for="docName">Enter your document name:</label>'
                  + '<br>'
                  + '<input type="text" id="docName" name="docName">'
                  + '<br>'
                  // If hit cancel button, remove message and continue to malnipulate with text editor.
                  + '<button id="cancelBtn" style="background-color: #6E85B7; color: #fff; border: none; margin-top: 5px; margin-right: 10px" onclick=cancelSaving(cancelBtn)>Cancel</button>'
                  // If hit save button, remove message, remove text editor and store data into database.
                  + '<button id="saveBtn" style="background-color: #6E85B7; color: #fff; border: none; margin-top: 5px; margin-left: 10px" onclick=savingEdition(saveBtn,inputName,inputContent,tinymce,docName,newTextArea,globaldocumentName)>OK</button>';
                  messageBlock.innerHTML = htmlcode;
                  document.body.appendChild(messageBlock);
                }
              });

            }
          });
      } 
  }

  // Support function

  function savingEdition(saveBtn,inputName,inputContent,tinymce,docName,newTextArea,globaldocumentName) {
    // Get input name which user have just type in
    inputName = docName.value;
    // Get input data in text editor
    inputContent = tinymce.activeEditor.getContent();
    document.body.removeChild(saveBtn.parentNode);
    localStorage.setItem(inputName, JSON.stringify(inputContent));
    localStorage.removeItem(globaldocumentName);
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
    window.location.href = "https://www.facebook.com/luuthieu.ltgk03";
  }
  
  function goToLinkedIn() {
    window.location.href = "https://www.linkedin.com/feed/?trk=onboarding-landing";
  }