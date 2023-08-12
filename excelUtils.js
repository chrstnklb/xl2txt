const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = path.join(__dirname, 'docs/Test/Erfassungsbeleg TEST.xlsx');
const workBook = xlsx.readFile(excelPath);
const workSheet = workBook.Sheets['Personalliste'];

module.exports.readCell = (cellCoordinate, targetFormat) => {
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
}
