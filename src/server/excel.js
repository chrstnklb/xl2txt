const xlsx = require('xlsx');
const path = require('path');
const ErrorList = require('./error.js');

const HEADER_ROW = 3;
const ROW_OF_FIRST_PERSONALNUMMER = 5;

let workSheet = undefined;

module.exports = {

    initExcelFile: function (excelFile, sheetNumber = 0) {
        const workBook = this.getWorkBook(excelFile);
        let actualFirstSheetName = workBook.SheetNames[sheetNumber];
        workSheet = workBook.Sheets[actualFirstSheetName];
        return workSheet;
    },

    getWorkBook: function (excelFile) {
        return workBook = xlsx.readFile(path.join(__dirname, "../exchange", excelFile));
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

    getNumberOfLastDataRow: function () {
        let rowCountStart = ROW_OF_FIRST_PERSONALNUMMER;
        let actualRow = rowCountStart;
        while (workSheet['A' + actualRow] !== undefined) {
            actualRow++;
        }
        return actualRow - 1;
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
            let cell = workSheet['A' + i];
        }
    },

    getCellCoordinate: function (col, row) {
        return xlsx.utils.encode_col(col) + row;
    },

    cellExists: function (cell) {
        return cell !== undefined
    }

}