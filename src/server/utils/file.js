const path = require('path');
const time = require('./time');
const fs = require('fs');

module.exports = {
    
    writeToFile: function (folder, filename, data) {
        this.writeDirectory(folder);
        let filepath = path.join(folder, filename);
        fs.writeFile(filepath, data, function (err) {
            if (err) throw err;
        });
        return filepath;
    },
    
    writeDirectory: function (path) {
        fs.mkdirSync(path, { recursive: true });
    }

}