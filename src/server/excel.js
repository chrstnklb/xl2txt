const xlsx = require('xlsx');
const path = require('path');
const ErrorList = require('./error.js');

const headerRow = 3;

let workSheet = undefined;

const FIRST_SHEET_NAME = 'Personalliste';

module.exports = {

    initExcelFile: function (excelFile) {
        const workBook = xlsx.readFile(path.join(__dirname, "../exchange", excelFile));
        let actualFirstSheetName = workBook.SheetNames[0];
        if (actualFirstSheetName !== FIRST_SHEET_NAME) {
            workSheet = workBook.Sheets[actualFirstSheetName];
            ErrorList.addError(
                `Erwartete erste Arbeitsmappe heißt nicht wie erwartet '${FIRST_SHEET_NAME}', ` +
                `sondern '${actualFirstSheetName}'.`);
        } else {
            workSheet = workBook.Sheets[FIRST_SHEET_NAME];
        }
        return workSheet;
    },

    readCell: (cellCoordinate, targetFormat) => {
        let result = undefined;
        if (workSheet.hasOwnProperty(cellCoordinate)) {
            const data = workSheet[cellCoordinate].v;
            if (targetFormat === 'number') {
                if (/^[0-9,.]+$/.test(data)) {
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

    getRowCount: function () {
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const rowCount = range.e.r - range.s.r + 1;
        return rowCount;
    },

    iterateColumns: function () {
        let cols = this.getColCount();
        for (let i = fixedColumns - 1; i < cols; i++) {
            let cell = workSheet[xlsx.utils.encode_col(i) + headerRow];
        }
    },

    iterateRows: function () {
        let rows = this.getRowCount();
        for (let i = headerRow; i < rows; i++) {
            let cell = workSheet['A' + i];
        }
    },

}