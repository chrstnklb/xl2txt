const path = require('path');
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
    },

    deleteFile: async function (filename) {
        await fs.unlink(filename, (err) => {
            if (err) throw err;
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
    }


}