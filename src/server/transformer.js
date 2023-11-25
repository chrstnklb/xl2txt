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
let metric = undefined;

function transformToCSV(excelFile) {

    metric = new Metric();
    Timer.startTimer();

    let workSheet = excel.initExcelFile(excelFile);

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06
    /*Check for error in header*/
    felder.readPersonalnummer(cellCoordinate = 'A4'); // 01

    let allLines = "";

    // iterate over all rows
    let lastDataRow = excel.getNumberOfLastDataRow();

    metric.setRowCount(lastDataRow - DATA_START_ROW);

    for (let row = DATA_START_ROW; row <= lastDataRow; row++) {

        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        metric.setColCount(colCount);

        for (let col = FIXED_COLUMNS; col < colCount; col++) {

            let cellCoordinate = getCellCoordinate(col, row);

            if (cellExists(workSheet[cellCoordinate])) {
                let headerCellContent = workSheet[getCellCoordinate(col, LOHNART_ROW + 1)].v;
                let feld = replaceDots(excel.readCell(getCellCoordinate(col, row), 'number'));
                allLines += createOneLine(firmennummer, abrechnungszeitraum, personalnummer, headerCellContent, feld);
            }
        }
    }
    timestamp = time.getActualTimeStampYYYYMMDDhhmmss();
    // TODO: simplify metric
    metric.setTimestamp(timestamp);
    metric.setCalculationTimeInMs(Timer.endTimer());

    deleteUploadedFiles(excelFile, timestamp);
    writeMetric(metric);
    return writeTxtFile(allLines, timestamp);
}

function replaceDots(feld) {
    try { feld = feld.toFixed(2).toString().replace('.', ','); }
    catch (error) { console.log(error); }
    return feld;
}

function getCellCoordinate(col, row) {
    return xlsx.utils.encode_col(col) + row;
}

function cellExists(cell) {
    return cell !== undefined
}

function createOneLine(firmennummer, abrechnungszeitraum, personalnummer, headerCellContent, feld) {
    // Folgende Felder werden aktuell nicht einbezogen
    let kostenstelle = '';
    let kostentraeger = '';
    let abrechnungstag = '';
    let lohnsatz = '';
    let prozentsatz = '';

    return `${firmennummer};` +
        `${personalnummer};` +
        `${felder.readLohnart(headerCellContent)};` + // 02

        `${kostenstelle};` +
        `${kostentraeger};` +
        `${abrechnungstag};` +

        `${abrechnungszeitraum};` +

        `${lohnsatz};` +
        `${prozentsatz};` +

        `${felder.setAnzahlTage(headerCellContent, feld)};` +
        `${felder.setAnzahlStunden(headerCellContent, feld)};` +
        `${felder.setBetrag(headerCellContent, feld)}` +
        '\n'
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