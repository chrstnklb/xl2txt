const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const felder = require('./felder.js');

const excel = require('./excel.js');
const fixedColumns = 2;
const lohnartRow = 3;
const dataStartRow = 4;

function transformToCSV(excelFile) {

    let statistics = {
        'timestamp': '',
        'colCount': 0,
        'rowCount': 0,
        'calculation-time-in-ms': 0,
    };
    let start = new Date().getTime();

    let workSheet = excel.initExcelFile(excelFile);

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    let allLines = "";

    // iterate over all rows
    let rowCount = excel.getRowCount();
    statistics.rowCount = rowCount;
    for (let row = dataStartRow + 1; row <= rowCount; row++) {
        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        statistics.colCount = colCount;
        for (let col = fixedColumns; col < colCount; col++) {
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

                let cellCoordinate = xlsx.utils.encode_col(col) + (lohnartRow + 1);
                let headerCellContent = workSheet[cellCoordinate].v;

                let feld = excel.readCell(cellCoordinate = (xlsx.utils.encode_col(col) + row), 'number');
                feld = feld.toFixed(2).toString().replace('.', ',');

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

    statistics.timestamp = getActualTimeStampYYYYMMDDhhmmss();

    let end = new Date().getTime();
    statistics['calculation-time-in-ms'] = end - start;
    console.log(statistics);
    // write statistics to file for later analysis in folder server / statistics
    fs.writeFile(path.join(__dirname, 'statistics/statistic-' + statistics.timestamp + '.json'), JSON.stringify(statistics), function (err) {
        if (err) throw err;
    });


    return writeToFile(allLines);
}

function writeToFile(allLines) {
    // log only the first 3 and the last 3 lines
    let lines = allLines.split('\n');
    let firstLines = lines.slice(0, 2);
    let lastLines = lines.slice(-3);
    console.log(firstLines);
    console.log('...');
    console.log(lastLines);
    timestamp = getActualTimeStampHHMMSS();
    const targetFilename = path.join(__dirname, '../exchange/downloads/download-' + timestamp + '.txt');
    fs.writeFile(targetFilename, allLines, function (err) {
        if (err) throw err;
    });
    return targetFilename
}

function getActualTimeStampHHMMSS() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}-${minutes}-${seconds}`;
}

function getActualTimeStampYYYYMMDDhhmmss() {
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}-` + getActualTimeStampHHMMSS();
}

exports.transformToCSV = transformToCSV;
exports.getActualTimeStamp = getActualTimeStampHHMMSS;