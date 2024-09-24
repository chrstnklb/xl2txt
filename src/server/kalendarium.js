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