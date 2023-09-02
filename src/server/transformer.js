const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const felder = require('./felder.js');
const time = require('./utils/time.js');
const file = require('./utils/file.js');

const excel = require('./excel.js');
const fixedColumns = 2;
const lohnartRow = 3;
const dataStartRow = 4;
let timestamp = '';

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

    statistics.timestamp = time.getActualTimeStampYYYYMMDDhhmmss();

    let end = new Date().getTime();
    statistics['calculation-time-in-ms'] = end - start;
    console.log(statistics);
    fs.writeFile(path.join(__dirname, 'statistics/statistic-' + statistics.timestamp + '.json'), JSON.stringify(statistics), function (err) {
        if (err) throw err;
    });

    return file.writeToFile(allLines);
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;