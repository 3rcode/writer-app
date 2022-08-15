// const documentItem = [];

// const workplace = document.getElementById('Workplace');
// let cache = document.createElement('div');
// const localStorage = document.getElementById('LocalStorage');
// function openTextEditor() {
//   if (tinymce.activeEditor == null) {
//   let newTextArea = document.createElement('textarea');
//   workplace.appendChild(newTextArea);  
//     tinymce.init({
//         target: newTextArea,
//         plugins: 'a11ychecker advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinycomments tinymcespellchecker',
//         toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents myButton',
//         toolbar_mode: 'floating',
//         tinycomments_mode: 'embedded',
//         tinycomments_author: 'Author name',
//         setup: function(editor) {
//           editor.ui.registry.addButton('myButton', {
//             text: "Save",
//             onAction: function(_) {
//               cache.innerHTML = tinymce.activeEditor.getContent();  
//               const object = {
//                 content: cache,
//                 index: documentItem.length + 1
//               }
//               documentItem.push(object);
//               renderDocumentItem();
//               tinymce.remove();
//               //getDocumentName(newTextArea);
//               newTextArea.remove();
//             }
//           });
//         }
//       });
//   }  
// }

// function renderDocumentItem() {
//   const html = documentItem.map(item => ('<div class="Item" style="background-color: #6E85B7; padding: 1% 10% 1% 10%; border-radius: 1rem; margin-bottom: 1%"> <span class="documentName" style="color: #fff">' + 'Document_' + item.index + '</span> <button class="button-icon" onclick=deleteDoc(' + item.index + ') style="float: right"><i class="fa-solid fa-trash-can"></i></button> <button class="button-icon" onclick=editDoc('+ item.index + ') style="float: right"><i class="fa-solid fa-pen-to-square"></i></button> </div>')).join('');
//   localStorage.innerHTML = html;
// }

// function sendMail() {
//   let link = "mailto:luuvanducthieu291@gmail.com"
//   window.location.href = link;
// }

// function goToFacebook() {
//   window.location.href = "https://www.facebook.com/luu.thieu.9659";
// }

// function goToLinkedIn() {
//   window.location.href = "https://www.linkedin.com/feed/?trk=onboarding-landing";
// }


// function deleteDoc() {
//   console.log("In here");
// }
// function editDoc(value) {
//   console.log("In here");
// }

// function insertAfter(newNode, existingNode) {
//   existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
// }

// function getDocumentName(location) {
  
// }
