const excel = require('./excel.js');
const felder = require('./felder.js');
const fileHandler = require('./utils/fileHandler.js');
const Metric = require('./utils/metric.js');

const FIXED_COLUMNS = 2;
const KALENDARIUM_FIXED_COLUMNS = 3;
const LOHNART_ROW = 3;
const DATA_START_ROW = 5;
let metric = undefined;

function transformToCSV(excelFile) {
    // if (hasSeveralSheets(excelFile) === true) {
    //     return transformKalendariumToTxt(excelFile);
    // } else {
    return transformLohnabrechnungToTxt(excelFile);
    // }
}

function hasSeveralSheets(excelFile) {
    const workBook = excel.getWorkBook(excelFile);
    return workBook.SheetNames.length > 1;
}

function transformLohnabrechnungToTxt(excelFile) {
    metric = new Metric();

    let workSheet = excel.initExcelFile(excelFile, sheetNumber = 0);

    let mandantennummer = felder.readMandantennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    /*Check for error in header*/
    felder.readPersonalnummer(cellCoordinate = 'A4'); // 01

    let allLines = "";

    let lastDataRow = excel.getNumberOfLastDataRow();

    metric.setRowCount(lastDataRow - DATA_START_ROW);

    for (let row = DATA_START_ROW; row <= lastDataRow; row++) {

        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        metric.setColCount(colCount);

        for (let col = FIXED_COLUMNS; col < colCount; col++) {
            // Wenn Zelle nicht leer ist
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
                // Wenn Lohnart Zelle nicht leer ist
                // if (workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)] !== undefined) {

                if (lohnArtIsInvalid(workSheet, col, LOHNART_ROW + 1)) {
                    let headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                    let feld = replaceDots(excel.readCell(excel.getCellCoordinate(col, row), 'number'));
                    feld = checkForZero(feld);
                    allLines += createOneLine(mandantennummer, personalnummer, headerCellContent, abrechnungszeitraum, feld, feldIsSum = false);
                }
            }
        }
    }

    // find duplicated lines, except for the last 4 columns
    let uniLines =  deduplicateLines(allLines);

    
    let fileData = '';
    for (let i = 0; i < uniLines.length; i++) {
        // console.log("uniLines[i]:" + uniLines[i]);
        let columns = uniLines[i].split(';');
        // console.log("columns:" + columns);
        fileData += createOneLineWithConcreteData(
            columns[0], columns[1], columns[2],
            columns[3], columns[4], columns[5],
            columns[6], columns[7], columns[8],
            columns[9], columns[10], columns[11]
        );
    }

    // console.log("uniLines:######" + fileData);
        

    fileHandler.deleteUploadedFiles();
    metric.writeMetric();
    return fileHandler.writeTxtFile(fileData);
}

function deduplicateLines(allLines) {
    console.log("allLines:" +"\n" + allLines);

    let lines = allLines.split('\n');
    lines.pop();

    let uniqueLines = [];
    for (let i = 0; i < lines.length; i++) {
        let columns = lines[i].split(';');

        let hasSameKostentraeger = true;
        for (let j = i + 1; j < lines.length; j++) {

            let potentialduplicatedColumns = lines[j].split(';');

            hasSameKostentraeger = isSameKostentraeger(columns, potentialduplicatedColumns);

            if (hasSameKostentraeger) {

                columns[columns.length - 3] = sumUp(columns, potentialduplicatedColumns, 3);
                columns[columns.length - 2] = sumUp(columns, potentialduplicatedColumns, 2);
                columns[columns.length - 1] = sumUp(columns, potentialduplicatedColumns, 1);

                let mergedLine = columns.join(';');

               lines.splice(j, 1); // remove the duplicate line
               lines.splice(j-1, 1); // remove the original line
                uniqueLines.push(mergedLine); // add the merged line

                console.log("uniqueLines: \n" + uniqueLines);

            }
        }

        // End of loop, if no duplicate Kostenstelle found
        if(!hasSameKostentraeger || i === lines.length - 1) {
            uniqueLines.push(lines[i]);
        }

    }
    console.log("uniqueLines:" + uniqueLines);
    return uniqueLines;
}

function sumUp(columns, potentialduplicatedColumns, endDistance) {

    
    let firstValue = parseFloat(columns[columns.length - endDistance].replace(',', '.'));
    firstValue = isNaN(firstValue) ? '' : firstValue;
    
    let secondValue = parseFloat(potentialduplicatedColumns[potentialduplicatedColumns.length - endDistance].replace(',', '.'));
    secondValue = isNaN(secondValue) ? '' : secondValue;
    
    let result = firstValue + secondValue;
    if (result!=='') {
        result = result.toFixed(2).toString().replace('.', ',');
    }
    // format reult to format 3,00 by also adding zeros
    return result;
}

function isSameKostentraeger(columns, potentialduplicatedColumns) {
    for (let k = 0; k < 4; k++) {
        if (columns[k] !== potentialduplicatedColumns[k]) {
            return false;
        }
    }
    return true;
}

function checkForZero(feld) {
    if (feld === "0,00") {
        return "";
    }
    return feld;
}

function lohnArtIsInvalid(workSheet, col, row) {
    let cell = workSheet[excel.getCellCoordinate(col, row)];
    // console.log("cell:" + JSON.stringify(cell));

    if (!excel.cellExists(cell)) {
        return false;
    }

    if (cell.v === undefined) {
        return false;
    }

    if (
        !cell.v.includes('KOSTENST')
        && !cell.v.includes('LSATZ')
        && !cell.v.includes('ANZSTD')
        && !cell.v.includes('KOSTENTR')
        && !cell.v.includes('PSATZ')
        && !cell.v.includes('BETRAG')
        && !cell.v.includes('Abrechnungstag')
        && !cell.v.includes('ANZTAGE')
    ) {
        console.log("ups" + cell.v);
        return false;
    }

    return true;

}

function transformKalendariumToTxt(excelFile) {
    metric = new Metric();
    let allLines = "";

    for (let sheetNumber = 1; sheetNumber < excel.getNumberOfSheets(); sheetNumber++) {
        let workSheet = excel.initExcelFile(excelFile, sheetNumber);

        let lastDataRow = excel.getNumberOfLastDataRow();
        let colCount = excel.getColCount();
        metric.setRowCount(lastDataRow - DATA_START_ROW);
        metric.setColCount(colCount);

        let firmennummer = felder.readMandantennummer(); // 00
        let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06
        // Check existance of personalnummer header
        felder.readPersonalnummer(cellCoordinate = 'A4'); // 01
        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + DATA_START_ROW)); // 01

        for (let col = KALENDARIUM_FIXED_COLUMNS; col < colCount; col++) {
            let colSum = 0;
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, DATA_START_ROW)]) !== undefined) {
                colSum = getSumOfColumn(workSheet, col, DATA_START_ROW, lastDataRow);
            }
            if (colSum !== "0,00") {
                let headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                allLines += createOneLine(mandantennummer, personalnummer, headerCellContent, abrechnungszeitraum, colSum);
            }
        }
    }

    fileHandler.deleteUploadedFiles();
    metric.writeMetric();
    return fileHandler.writeTxtFile(allLines);

}

function getSumOfColumn(workSheet, col, startRow, endRow) {
    let sum = 0;
    for (let row = startRow; row <= endRow; row++) {
        if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
            let feld = excel.readCell(excel.getCellCoordinate(col, row), 'number');
            sum = sum + feld;
        }
    }
    if (sum % 1 === 0 || sum.toString().includes('.')) {
        sum = replaceDots(sum);
    }
    return sum;
}

function findCellsWithContent(workSheet, startRow, endRow, col) {
    for (let row = startRow; row <= endRow; row++) {
        if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
            return true;
        }
    }
    return false;
}


function replaceDots(feld) {
    try { feld = feld.toFixed(2).toString().replace('.', ','); }
    catch (error) { console.log(error); }
    return feld;
}

function createOneLine(mandantennummer, personalnummer, headerCellContent, abrechnungszeitraum, feld) {
    // Folgende Felder werden aktuell nicht einbezogen
    let kostenstelle = '';
    let kostentraeger = '';
    let abrechnungstag = '';
    let lohnsatz = '';
    let prozentsatz = '';

    return createOneLineWithConcreteData(
        mandantennummer,
        personalnummer,
        felder.readLohnart(headerCellContent),

        kostenstelle,
        kostentraeger,
        abrechnungstag,
        abrechnungszeitraum,
        lohnsatz,
        prozentsatz,

        felder.setAnzahlTage(headerCellContent, feld),
        felder.setAnzahlStunden(headerCellContent, feld),
        felder.setBetrag(headerCellContent, feld)
    )

}

function createOneLineWithConcreteData(
    mandantennummer,
    personalnummer,
    lohnart,

    kostenstelle,
    kostentraeger,
    abrechnungstag,
    abrechnungszeitraum,
    lohnsatz,
    prozentsatz,

    anzahlTage,
    anzahlStunden,
    betrag) {
    return `${mandantennummer};` +
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
        '\n'
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;