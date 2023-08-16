const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const { get } = require('http');

const excelPath = path.join(__dirname, 'docs/Test/Erfassungsbeleg TEST.xlsx');
const workBook = xlsx.readFile(excelPath);
const workSheet = workBook.Sheets['Personalliste'];

const fixedColumns = 6;
const headerRow = 3;

module.exports = {

    readCell: (cellCoordinate, targetFormat) => {
        console.log(workSheet[cellCoordinate]);
        let result = undefined;
        if (workSheet.hasOwnProperty(cellCoordinate)) {
            const data = workSheet[cellCoordinate].v;
            if (targetFormat === 'number') result = data;
            if (targetFormat === 'string') result = data.toString();
            if (targetFormat === 'date') result = xlsx.SSF.parse_date_code(data);
        }
        console.log(result);
        return result;
    },

    getColCount: function () {
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const colCount = range.e.c - range.s.c + 1
        console.log("colCount: " + colCount);
        return colCount;
    },

    getRowCount: function () {
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const rowCount = range.e.r - range.s.r + 1;
        console.log("rowCount: " + rowCount);
        return rowCount;
    },

    iterateColumns: function () {
        let cols = this.getColCount();
        for (let i = fixedColumns - 1; i < cols; i++) {
            let cell = workSheet[xlsx.utils.encode_col(i) + headerRow];
            console.log('cell: ' + JSON.stringify(cell.v));
        }
    },

    iterateRows: function () {
        let rows = this.getRowCount();
        for (let i = headerRow; i < rows; i++) {
            let cell = workSheet['A' + i];
            console.log('cell: ' + JSON.stringify(cell.v));
        }
    }



}