const express = require('express');
const path = require('path');

const transformer = require('./transformer.js');

const app = express();

const port = 3000;
const url = `http://localhost:${port}`

const { getType }   = require('mime');

app.use(express.static(path.join(__dirname, '../client')))

app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    const type = getType(path);
    if (type === 'application/javascript' || type === 'text/css') {
      res.setHeader('Content-Type', type);
    }
  }
}));

app.post("/upload", initMulterUpload().single('upload-'), (req, res) => {
    logServerRouteUpload('filename',  req.file.filename);

    const targetFilename = transformer.transformToCSV("./uploads/" + req.file.filename);
    console.log("./uploads/" + req.file.filename);

    deleteFile(path.join(__dirname, "../exchange/uploads/" , req.file.filename));

    const txtFileName = targetFilename.replace('upload', 'download');

    res.json({ fileName: txtFileName });
});

app.post('/download', function(req, res){
    logServerRouteDownload('filename',  req.query.fileName);

    const file = req.query.fileName;

    res.download(file);
    res.on('finish', () => {
        deleteFile(file);
    });

    logServerRouteDownload('file',  file);
});

app.listen(port, () => {
    logServer(`listening at ${url}`);
});

/**************************/
/*  HELPER FUNCTIONS      */
/**************************/

async function deleteFile(filename) {
    const fs = require('fs');

    await fs.unlink(filename, (err) => {
        if (err) throw err;
        logServerRouteUpload( 'deleted', filename);
    });
}

function initMulterUpload() {
    const multer = require('multer');
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../exchange/uploads/'));
            },
            filename: function (req, file, cb) {
                let timestamp = transformer.getActualTimeStamp();
                cb(null, file.fieldname + timestamp + '.xlsx')
            }
        })
    });
}

/**************************/
/*  LOGGING FUNCTIONS     */
/**************************/

function logServerRouteUpload(describer, value) {
    logServerRoute(`upload:${describer}:${value}`);
}

function logServerRouteDownload(describer, value) {
    logServerRoute(`download:${describer}:${value}`);
}

function logServer(message) {
    console.log(`server:${message}`);
}

function logServerRoute(route) {
    logServer(`route:${route}`);
}