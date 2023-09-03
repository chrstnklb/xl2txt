
function dropHandler(ev) {
    let transformedFilename = '';
    clientLog("file dropped", "green");

    preventFileToOpen(ev);

    const files = ev.dataTransfer.files;
    const formData = new FormData();
    formData.append('upload', files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            transformedFilename = result.fileName;
            displayDownloadButton();
        })
        .then(() => { prepareDownload(transformedFilename); })
        .catch(error => { console.error('Error:', error); });
}

function dragOverHandler(ev) {
    clientLog("file in drop zone", "yellow");
    preventFileToOpen(ev);
    setBackGroundColor(ev, "green");
}

function dragLeaveHandler(ev) {
    clientLog("file left drop zone", "red");
    preventFileToOpen(ev);
    setBackGroundColor(ev, "yellow");
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
    downloadButton.style.display = 'block';
}

function displayRestartButton() {
    const restartButton = document.getElementById('restartForm');
    restartButton.style.display = 'block';
}

function setBackGroundColor(ev, color) {
    ev.target.style.backgroundColor = color;
}


/**************************/
/*  LOGGING FUNCTIONS     */
/**************************/
function clientLog(message, textColor = 'white') {
    console.log('%c client :: ' + message, 'color: ' + textColor);
}