// UI Components
/**
 * I injected this component into HTML Document Dynamically
 * No need to add `<div id="alertModal"> </div>` in HTML Document
 */
function openModal(text, name, type) {
  let alertModalElement = document.createElement("div");
  alertModalElement.className = "modal";
  alertModalElement.setAttribute("id", "alertModal");
  alertModalElement.style.display = "block";

  let alert = `<div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title"> ${name} </h4>
              <button type="button" class="close btn btn-${type}" data-dismiss="modal" onclick='closeModal()'>&times;</button>
            </div>
            <div class="modal-body">
              ${text}
            </div>          
            <div class="modal-footer">
              <button type="button" class="btn btn-${type}" onclick='closeModal()' data-dismiss="modal">Close</button>
            </div>
            
          </div>
        </div>`;
  alertModalElement.innerHTML = alert;
  document.body.appendChild(alertModalElement);
}

function closeModal() {
  document.getElementById("alertModal")
    ? document.getElementById("alertModal").remove()
    : "";
}

function alertModal(text, name = "Alert", type = "danger", duration = 3000) {
  openModal(text, name, type);
  setTimeout(() => {
    closeModal();
  }, duration);
}

function toggleSpinner() {
  document.getElementById("loading").classList.toggle("d-none");
}

