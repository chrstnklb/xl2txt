const xlsx = require('xlsx');
const path = require('path');
const ErrorList = require('./error.js');

const HEADER_ROW = 3;
const ROW_OF_FIRST_PERSONALNUMMER = 5;

const COLUMN_OF_PERSONALNUMMER = 'A';

let workSheet = undefined;

module.exports = {

    hasSeveralSheets: function (excelFile) {
        const workBook = excel.getWorkBook(excelFile);
        return workBook.SheetNames.length > 1;
    },

    initExcelFile: function (excelFile, sheetNumber = 0) {
        const workBook = this.getWorkBook(excelFile);
        let actualFirstSheetName = workBook.SheetNames[sheetNumber];
        workSheet = workBook.Sheets[actualFirstSheetName];
        return workSheet;
    },

    getWorkBook: function (excelFile) {
        return workBook = xlsx.readFile(path.join(__dirname, "../exchange", excelFile));
    },

    getNumberOfSheets: function () {
        return workBook.SheetNames.length;
    },

    readCell: (cellCoordinate, targetFormat) => {
        let result = undefined;
        if (workSheet.hasOwnProperty(cellCoordinate)) {
            const data = workSheet[cellCoordinate].v;
            if (targetFormat === 'number') {
                // Erlaube folgende Formate: 123, 123.45, -123, -123.45
                // -123456 - Eine einfache negative ganze Zahl.
                // 987654 - Eine einfache positive ganze Zahl.
                // -12.34 - Eine negative Dezimalzahl mit einem Punkt.
                // 1234,56 - Eine positive Dezimalzahl mit einem Komma.
                // 0 - Null als ganze Zahl.
                // -9999999 - Eine große negative ganze Zahl.
                // 0.1234 - Eine kleine positive Dezimalzahl mit einem Punkt.
                // -123 - Eine kurze negative ganze Zahl.
                // 456 - Eine kurze positive ganze Zahl.
                // -7890.123 - Eine negative Dezimalzahl mit einem Punkt.
                if (/^-?[0-9]+([,.][0-9]+)?$/.test(data)) {
                    result = data;
                } else {
                    ErrorList.addError(
                        `Die Zelle '${cellCoordinate}' beinhaltet '${data}', ` +
                        `welches keine (gültige) Zahl ist!`);
                }

            }
            if (targetFormat === 'string') result = data.toString();
            if (targetFormat === 'date') result = xlsx.SSF.parse_date_code(data);
        }
        return result;
    },

    getColCount: function () {
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const colCount = range.e.c - range.s.c + 1
        return colCount;
    },

    getNumberOfLastDataRow: function () {
        let rowCountStart = ROW_OF_FIRST_PERSONALNUMMER;
        let actualRow = rowCountStart;

        while (workSheet[COLUMN_OF_PERSONALNUMMER + actualRow] !== undefined) {
            // check that the cell value is a number
            if (isNaN(workSheet[COLUMN_OF_PERSONALNUMMER + actualRow].v)) {
                ErrorList.addError(`Die Personalnummer in der Zelle ${COLUMN_OF_PERSONALNUMMER}${actualRow} ist inkorrekt (nicht numerisch)`);
            }
            actualRow++;
        }

        // check if there are still rows with data after the first empty cell
        this.checkForEmptyPersonalnummer(actualRow);

        return actualRow - 1;
    },

    checkForEmptyPersonalnummer: function (actualRow) {
        let row = actualRow;
        
        // Check for empty cells in the personalnummer column after the first empty cell found to ensure no more data is present
        let threshold = 10; // arbitrary number to prevent infinite loop
        let emptyCellCount = 0;
        while (workSheet[COLUMN_OF_PERSONALNUMMER + row] === undefined) {
            row++;
            emptyCellCount++;
            if (emptyCellCount > threshold) {
                return;
            }
        }
        // END Check for empty cells in the personalnummer column after the first empty cell found to ensure no more data is present

        if (row > actualRow) {
            ErrorList.addError(`Die Personalnummer in der Zelle ${COLUMN_OF_PERSONALNUMMER}${actualRow} ist inkorrekt (leer)`);
        }


    },

    iterateColumns: function () {
        let cols = this.getColCount();
        for (let i = fixedColumns - 1; i < cols; i++) {
            let cell = workSheet[xlsx.utils.encode_col(i) + HEADER_ROW];
        }
    },

    iterateRows: function () {
        let rows = this.getNumberOfLastDataRow();
        for (let i = HEADER_ROW; i < rows; i++) {
            let cell = workSheet[COLUMN_OF_PERSONALNUMMER + i];
        }
    },

    getCellCoordinate: function (col, row) {
        return xlsx.utils.encode_col(col) + row;
    },

    cellExists: function (cell) {
        return cell !== undefined
    }

}