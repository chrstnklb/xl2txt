const express = require('express');
const transformer = require('./transformer3.js');

const app = express();

const port = 3000;
const url = `http://localhost:${port}`

const { getType }   = require('mime');

app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    const type = getType(path);
    if (type === 'application/javascript' || type === 'text/css') {
      res.setHeader('Content-Type', type);
    }
  }
}));

app.post("/upload", initMulterUpload().single('file'), (req, res) => {
    const path = require('path');

    const targetFilename = transformer.transformToCSV("./uploads/" + req.file.filename);

    const csvFileName = targetFilename.replace('file', 'output').replace('.xlsx', '.csv');

    const filePath = path.join(__dirname, csvFileName);

    serverRouteUploadLog('csvFileName', csvFileName);

    res.json({ fileName: csvFileName });

    console.log('up ok');

});

app.post('/download', function(req, res){

    serverRouteDownloadLog('req.query.fileName', req.query.fileName);

    const file = req.query.fileName;
    console.log('file: ' + file)

    res.download(file);
});

app.listen(port, () => {
    serverLog(`listening at ${url}`);
});

/**************************/
/*  HELPER FUNCTIONS      */
/**************************/

function initMulterUpload() {
    const multer = require('multer');
    return multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, __dirname + '/uploads')
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

function serverRouteUploadLog(describer, value) {
    serverRouteLog(`upload:${describer}:${value}`);
}

function serverRouteDownloadLog(describer, value) {
    serverRouteLog(`download:${describer}:${value}`);
}

function serverLog(message) {
    console.log(`server:${message}`);
}

function serverRouteLog(route) {
    serverLog(`route:${route}`);
}