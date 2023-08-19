const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'docs/Test/Erfassungsbeleg TEST.xlsx');
const workBook = xlsx.readFile(excelPath);
const workSheet = workBook.Sheets['Personalliste'];

const headerRow = 3;

module.exports = {

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