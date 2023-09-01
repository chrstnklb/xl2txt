const xlsx = require('xlsx');
const path = require('path');

const headerRow = 3;

let workSheet = undefined;

module.exports = {

    initExcelFile: function (excelFile) {
        const workBook = xlsx.readFile(path.join(__dirname, "../exchange", excelFile));
        workSheet = workBook.Sheets['Personalliste'];
        return workSheet;
    },

    readCell: (cellCoordinate, targetFormat) => {
        let result = undefined;
        if (workSheet.hasOwnProperty(cellCoordinate)) {
            const data = workSheet[cellCoordinate].v;
            if (targetFormat === 'number') result = data;
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