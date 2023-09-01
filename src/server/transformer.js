const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const felder = require('./felder.js');

const excel = require('./excel.js');
const excelPath = path.join(__dirname, './Erfassungsbeleg TEST.xlsx');
const workBook = xlsx.readFile(excelPath);
const workSheet = workBook.Sheets['Personalliste'];
const fixedColumns = 2;
const lohnartRow = 3;
const dataStartRow = 4;

// transformToCSV(excelPath);

function transformToCSV(excelFile) {

    let firmennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    let allLines = "";

    // iterate over all rows
    let rowCount = excel.getRowCount();
    for (let row = dataStartRow + 1; row <= rowCount; row++) {
        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
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
    timestamp = getActualTimeStamp();
    const targetFilename = path.join(__dirname, '../exchange/downloads/download-' + timestamp + '.txt');
        fs.writeFile(targetFilename, allLines, function (err) {
        if (err) throw err;
    });
    return targetFilename
}

function getActualTimeStamp() {
    const date = new Date();
    return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

exports.transformToCSV = transformToCSV;
exports.getActualTimeStamp = getActualTimeStamp;