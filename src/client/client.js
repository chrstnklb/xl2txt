const DRAG_OVER_COLOR = '#14908E';
const DRAG_LEAVE_COLOR = 'yellow';
const DRAG_OVER_OPACITY = 0.5;


function dropHandler(ev) {
    let transformedFilename = '';
    clientLog("file dropped", "green");

    preventFileToOpen(ev);

    const files = ev.dataTransfer.files;
    const formData = new FormData();
    formData.append('upload', files[0]);

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(result => { transformedFilename = result.fileName; })
        .then(() => { setDropAreaText('🎉 Prima 🎉'); })
        .then(() => { prepareDownload(transformedFilename); })
        .then(() => { displayDownloadButton(); })
        .catch(error => { console.error('Error:', error); });
}

function dragOverHandler(ev) {
    clientLog("file in drop zone", DRAG_OVER_COLOR);
    preventFileToOpen(ev);
    setBackGroundColor(ev, DRAG_OVER_COLOR);
    setBackGroundColorOpacity(ev, 1);
    setDropAreaText('Lass los!');
}

function setDropAreaText(text) {
    const dropAreaText = document.getElementById('drop-zone-text');
    dropAreaText.innerHTML = text;
}

function dragLeaveHandler(ev) {
    clientLog("file left drop zone", DRAG_LEAVE_COLOR);
    preventFileToOpen(ev);
    setBackGroundColor(ev, DRAG_LEAVE_COLOR);
    setBackGroundColorOpacity(ev, 0.5);
    setDropAreaText('Ziehe die Datei hier hinein!');
}

function setBackGroundColorOpacity(ev, opacity) {
    ev.target.style.opacity = opacity;
}

function prepareDownload(filename) {
    setDownloadElementsAction('downloadForm', filename);
    displayRestartButton();
}

/**************************/
/*  HELPER FUNCTIONS      */
/**************************/

function preventFileToOpen(ev) {
    ev.preventDefault();
}

function setDownloadElementsAction(id, transformedFilename) {
    const form = document.getElementById(id);
    const action = form.getAttribute('action');

    form.setAttribute('action', action + '?fileName=' + transformedFilename);

}

function displayDownloadButton() {
    const downloadButton = document.getElementById('downloadForm');
    downloadButton.hidden = false;
}

function displayRestartButton() {
    const restartButton = document.getElementById('restartForm');
    restartButton.hidden = false;
}

function setBackGroundColor(ev, color) {
    ev.target.style.backgroundColor = color;
}

function jumpTo(target) {
    var kontaktHeader = document.getElementById(target)
    kontaktHeader.scrollIntoView({ behavior: 'smooth' })
}


/**************************/
/*  LOGGING FUNCTIONS     */
/**************************/
function clientLog(message, textColor = 'white') {
    console.log('%c client :: ' + message, 'color: ' + textColor);
}