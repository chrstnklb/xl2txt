const express = require('express');
const path = require('path');

const transformer = require('../../transformer.js');

const app = express();

const port = 3000;
const url = `http://localhost:${port}`

const { getType }   = require('mime');

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html

app.use(express.static(path.join(__dirname, '../client')))

app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    const type = getType(path);
    if (type === 'application/javascript' || type === 'text/css') {
      res.setHeader('Content-Type', type);
    }
  }
}));

app.post("/upload", initMulterUpload().single('file'), (req, res) => {
    console.log('up');
    const targetFilename = transformer.transformToCSV("./uploads/" + req.file.filename);

    const csvFileName = targetFilename.replace('file', 'output').replace('.xlsx', '.csv');

    const filePath = path.join(__dirname, csvFileName);

    logServerRouteUpload('csvFileName', csvFileName);

    res.json({ fileName: csvFileName });

    console.log('up ok');

});

app.post('/download', function(req, res){

    logServerRouteDownload('req.query.fileName', req.query.fileName);

    const file = req.query.fileName;
    console.log('file: ' + file)

    res.download(file);
});

app.listen(port, () => {
    logServer(`listening at ${url}`);
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