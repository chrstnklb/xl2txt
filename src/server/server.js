const express = require('express');
const path = require('path');

const transformer = require('./transformer.js');
const fileHandler = require('./utils/fileHandler.js');
const logs = require('./utils/logs.js');

const app = express();

const port = 3000;
const url = `http://localhost:${port}`

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

    const targetFilename = transformer.transformToCSV("./uploads/" + req.file.filename);
    const txtFileName = targetFilename.replace('upload', 'download');
    res.json({
        fileName: txtFileName,
        uploadedFileName: req.file.filename,
        downloadFileName: transformer.TARGET_FILENAME,
    });
});

app.post('/download', function (req, res) {
    logs.logServerRouteDownload('filename', req.query.fileName);

    const file = req.query.fileName;

    res.download(file);
    res.on('finish', () => {
        fileHandler.deleteDirectoryOfFile(path.dirname(file));
    });

    logs.logServerRouteDownload('file', file);
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
                cb(null, path.join(__dirname, '../exchange/uploads/'));
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '.xlsx')
            }
        })
    });
}