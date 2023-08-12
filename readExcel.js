const fs = require('fs');
// import all functions from contentReader.js
const contentReader = require('./contentReader.js');

// 1. Check file consitency
// 2. Read Information from file
// 3. Write Information into csv file

let firmennummer = contentReader.readFirmennummer();
let personalnummer = contentReader.readPersonalnummer();
let lohnart = contentReader.readLohnart();
let kostenstelle = '';
let kostentraeger = '';
let abrechnungstag = '';
let abrechnungszeitraum = contentReader.readAbrechnungsZeitraum();
let lohnsatz = '';
let prozentsatz = '';
let anzahlTage = '';
let anzahlStunden = '';
let betrag = '';

// Write Firmennummer and Personalnummer in Format 1234567;00000008 into a csv file
const date = new Date();
const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
let csvData =
    `${firmennummer};` +
    `${personalnummer};` +
    `${lohnart};` +
    `${kostenstelle};` +
    `${kostentraeger};` +
    `${abrechnungstag};` +
    `${abrechnungszeitraum};` +
    `${lohnsatz};` +
    `${prozentsatz};` +
    `${anzahlTage};` +
    `${anzahlStunden};` +
    `${betrag};` + '   >>>   ' +
    `${timestamp}`;

fs.writeFileSync('output/output.csv', csvData); 