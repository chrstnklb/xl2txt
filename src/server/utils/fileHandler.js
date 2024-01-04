const path = require('path');
const fs = require('fs');
const time = require('./time.js');
const logs = require('./logs.js');

const TARGET_FILENAME = "Imp_lbw.txt";

module.exports = {

    writeToFile: function (folder, filename, data) {
        this.writeDirectory(folder);
        let filepath = path.join(folder, filename);
        fs.writeFile(filepath, data, function (err) {
            if (err) throw err;
            else logs.logCreatedFile(filepath);
        });
        return filepath;
    },

    writeDirectory: function (path) {
        fs.mkdirSync(path, { recursive: true });
    },

    deleteFile: async function (filename) {
        await fs.unlink(filename, (err) => {
            if (err) throw err;
            else logs.logDeletedFile(filename);
        });
    },

    deleteDirectoryOfFile: async function (path) {
        await fs.rm(path, { recursive: true }, (err) => {
            if (err) throw err;
        });
    },

    deleteFiles: async function (folder) {
        fs.readdir(folder, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                this.deleteFile(path.join(folder, file));
            }
        });
    },

    writeTxtFile: function (content) {
        const timestamp = time.getActualTimeStampYYYYMMDDhhmmss();
        const folder = path.join(__dirname, '../../exchange/downloads/' + timestamp);
        return this.writeToFile(folder, TARGET_FILENAME, content);
    },

    deleteUploadedFiles: function () {
        this.deleteFiles(path.join(__dirname, '../../exchange/uploads/'));
    }

}

exports.TARGET_FILENAME = TARGET_FILENAME;