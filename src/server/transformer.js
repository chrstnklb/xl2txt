const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excel = require('./excel.js');
const felder = require('./felder.js');
const fileHandler = require('./utils/fileHandler.js');
const time = require('./utils/time.js');
const Metric = require('./utils/metric.js');
const Timer = require('./utils/timer.js');

const TARGET_FILENAME = "Imp_lbw.txt";

const FIXED_COLUMNS = 2;
const LOHNART_ROW = 3;
const DATA_START_ROW = 5;
let timestamp = '';

function transformToCSV(excelFile) {

    let metric = new Metric();
    Timer.startTimer();

    let workSheet = excel.initExcelFile(excelFile);

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06
    /*Check for error in header*/
    felder.readPersonalnummer(cellCoordinate = 'A4'); // 01


    let allLines = "";

    // iterate over all rows
    let lastDataRow = excel.getNumberOfLastDataRow();

    metric.setRowCount(lastDataRow-DATA_START_ROW);
    console.log('lastDataRow: ' + lastDataRow);

    let counter = 0;
    for (let row = DATA_START_ROW; row <= lastDataRow; row++) {
        console.log('counter: ' + counter++);

        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        metric.setColCount(colCount);

        for (let col = FIXED_COLUMNS; col < colCount; col++) {

            let lohnart = '';
            let kostenstelle = '';
            let kostentraeger = '';
            let abrechnungstag = '';
            let lohnsatz = '';
            let prozentsatz = '';
            let anzahlTage = '';
            let anzahlStunden = '';
            let betrag = '';
            let cellCoordinate = xlsx.utils.encode_col(col) + row;
            let cell = workSheet[cellCoordinate];

            if (cell !== undefined) {

                let cellCoordinate = xlsx.utils.encode_col(col) + (LOHNART_ROW + 1);
                let headerCellContent = workSheet[cellCoordinate].v;

                let feldCoordinate = xlsx.utils.encode_col(col) + (row);
                let feld = excel.readCell(feldCoordinate, 'number');
                try {
                    feld = feld.toFixed(2).toString().replace('.', ',');
                } catch (error) {
                    console.log(error);
                }

                lohnart = felder.readLohnart(headerCellContent); // 02

                if (headerCellContent.includes('KOSTENST')) anzahlStunden = feld; // 03
                if (headerCellContent.includes('KOSTENTR')) betrag = feld; // 04
                if (headerCellContent.includes('Abrechnungstag')) anzahlTage = feld; // 05

                if (headerCellContent.includes('LSATZ')) anzahlStunden = feld; // 07
                if (headerCellContent.includes('PSATZ')) betrag = feld; // 08
                if (headerCellContent.includes('ANZTAGE')) anzahlTage = feld; // 09
                if (headerCellContent.includes('ANZSTD')) anzahlStunden = feld; // 10
                if (headerCellContent.includes('BETRAG')) betrag = feld; // 11

                allLines += `${firmennummer};` +
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
                    `${betrag}` +
                    '\n';
            }
        }
    }

    metric.setTimestamp(time.getActualTimeStampYYYYMMDDhhmmss());
    metric.setCalculationTimeInMs(Timer.endTimer());

    timestamp = time.getActualTimeStampYYYYMMDDhhmmss();

    deleteUploadedFiles(excelFile, timestamp);
    writeMetric(metric);
    return writeTxtFile(allLines, timestamp);
}

function deleteUploadedFiles() {
    fileHandler.deleteFiles(path.join(__dirname, '../exchange/uploads/'));
}

function writeTxtFile(content, timestamp) {
    const folder = path.join(__dirname, '../../src/exchange/downloads/' + timestamp);
    return fileHandler.writeToFile(folder, TARGET_FILENAME, content);
}

function writeMetric(metric) {
    let statFolder = path.join(__dirname, 'statistics/');
    let statFilename = 'metric-' + metric.getTimestamp() + '.json';
    let statData = JSON.stringify(metric);
    fileHandler.writeToFile(statFolder, statFilename, statData);
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;
exports.TARGET_FILENAME = TARGET_FILENAME;