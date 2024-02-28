const express = require('express');
const path = require('path');

const transformer = require('./transformer.js');
const fileHandler = require('./utils/fileHandler.js');
const logs = require('./utils/logs.js');

const UPLOAD_FOLDER = '../exchange/upload/';

const ErrorList = require('./error.js');

const app = express();

const port = 3000;
const url = `http://localhost:${port}`

let clientIp = undefined;

const { getType } = require('mime');

app.use(express.static(path.join(__dirname, '../client')))

app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        const type = getType(path);
        if (type === 'application/javascript' || type === 'text/css') {
            res.setHeader('Content-Type', type);
        }
    }
}));

app.post("/upload", initMulterUpload().single('upload'), (req, res) => {
    logs.logServerRouteUpload('filename', req.file.filename);

    // log ip address of client
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logs.logAttribute('ip address', ip);
    clientIp = ip;

    // start timer
    const start = new Date().getTime();
    const targetFilename = transformer.transformToCSV(UPLOAD_FOLDER + req.file.filename);
    // end timer
    const end = new Date().getTime();
    const time = end - start;
    const txtFileName = targetFilename.replace('upload', 'download');
    res.json({
        fileName: txtFileName,
        uploadedFileName: req.file.filename,
        downloadFileName: fileHandler.TARGET_FILENAME,
        errorList: ErrorList.errors,
        calculationTimeInMs: time
    });
    ErrorList.clearErrors();
});

// TODO: make it get request
app.post('/download', function (req, res) {
    const file = req.query.fileName;
    res.download(file);
    res.on('finish', () => { fileHandler.deleteDirectoryOfFile(path.dirname(file)); });
});

app.listen(port, () => {
    logs.logAttribute('listening at', url);
});

/**************************/
/*  HELPER FUNCTIONS      */
/**************************/

function initMulterUpload() {
    const multer = require('multer');
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {

                // if folder does not exist, create it
                if (!fileHandler.directoryExists(path.join(__dirname, UPLOAD_FOLDER))) {
                    fileHandler.writeDirectory(path.join(__dirname, UPLOAD_FOLDER));
                }
                cb(null, path.join(__dirname, UPLOAD_FOLDER));
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '.xlsx')
            }
        })
    });
}

module.exports = {
    clientIp: clientIp
}