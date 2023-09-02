const path = require('path');
const time = require('./time');
const fs = require('fs');


const TARGET_FILENAME = "Imp_lbw.txt";

module.exports = {
    writeToFile: function (allLines) {
        // log only the first 3 and the last 3 lines
        let lines = allLines.split('\n');
        console.log("First line : " + lines.slice(0, 1));
        console.log("Last line:   " + lines.slice(-2));
        timestamp = time.getActualTimeStampYYYYMMDDhhmmss();
        const targetFilename = path.join(__dirname, '../../exchange/downloads/' + timestamp + '/' + TARGET_FILENAME);

        fs.mkdirSync(path.join(__dirname, '../../exchange/downloads/' + timestamp));
        fs.writeFile(targetFilename, allLines, function (err) {
            if (err) throw err;
        });
        return targetFilename
    }
}