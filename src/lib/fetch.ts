// Legacy fetch helpers from old/src/client/fetch.js
// Refactored for Next.js and TypeScript as needed.

function setDownloadElementsAction(id: string, transformedFilename: string) {
    const form = document.getElementById(id) as HTMLFormElement | null;
    if (!form) return;
    // TODO: make it get request
    form.setAttribute('action', "/download" + '?fileName=' + encodeURIComponent(transformedFilename));
}

export function prepareDownload(filename: string) {
    setDownloadElementsAction('downloadForm', filename);
}

export function displayDownloadButton() {
    const downloadButton = document.getElementById('downloadForm');
    if (downloadButton) downloadButton.hidden = false;
}

export function displayRestartButton() {
    const restartButton = document.getElementById('restartForm');
    if (restartButton) restartButton.hidden = false;
}

export async function fetchUpload(formData: FormData): Promise<void> {
    let transformedFilename = '';
    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        const result = await response.json();
        transformedFilename = result.fileName;
        console.log('Upload date:', result);
        if (Array.isArray(result.errorList) && result.errorList.length > 0) {
            let alertMessage = 'Es sind Fehler aufgetreten: \n\n';
            result.errorList.forEach((error: { description: string }) => {
                alertMessage += error.description + "\n\n";
            });
            alert(alertMessage);
            console.log(alertMessage);
            console.log(result.calculationTimeInMs);
        } else {
            prepareDownload(transformedFilename);
            displayDownloadButton();
            displayRestartButton();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function fetchUploadStepper(formData: FormData): Promise<void> {
    let transformedFilename = '';
    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        const result = await response.json();
        transformedFilename = result.fileName;
        console.log('Upload date:', result);
        if (Array.isArray(result.errorList) && result.errorList.length > 0) {
            let alertMessage = 'Es sind Fehler aufgetreten: \n\n';
            result.errorList.forEach((error: { description: string }) => {
                alertMessage += error.description + "\n\n";
            });
            alert(alertMessage);
            console.log(alertMessage);
            console.log(result.calculationTimeInMs);
        } else {
            const form = document.getElementById("stepper-form-save") as HTMLFormElement | null;
            if (form) {
                // TODO: make it get request
                form.setAttribute('action', "/download" + '?fileName=' + encodeURIComponent(transformedFilename));
            }
            const stepperFormSave = document.getElementById('stepper-form-save');
            if (stepperFormSave) stepperFormSave.hidden = false;
            const stepperButtonConvert = document.getElementById('stepper-button-convert');
            if (stepperButtonConvert) stepperButtonConvert.setAttribute("class", "btn btn-warning");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export function setDropAreaText(text: string) {
    const dropZoneText = document.getElementById('drop-zone-text');
    if (dropZoneText) dropZoneText.innerHTML = text;
}
