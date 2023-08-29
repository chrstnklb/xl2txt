const express = require('express');
const transformer = require('./transformer.js');

const app = express();

const port = 3000;
const url = `https://localhost:${port}`

app.use(express.static('public'));

app.get('/', (req, res) => {
    serverLog('index');
    res.sendFile(__dirname + '/index.html');
});

app.post("/upload", initMulterUpload().single('file'), (req, res) => {
    const path = require('path');
    
    serverRouteUploadLog('');

    const targetFilename = transformer.transformToCSV("./uploads/" + req.file.filename);
    serverRouteUploadLog(`targetFilename :: ${targetFilename}`);

    const csvFileName = targetFilename.replace('file', 'output').replace('.xlsx', '.csv');

    const filePath = path.join(__dirname, csvFileName);
    serverRouteUploadLog(`filePath :: ${csvFileName}`);

    res.json({ fileName: csvFileName });

});

app.post('/download', function(req, res){

    serverRouteDownloadLog('');
    serverRouteDownloadLog(`req.query.fileName :: ${req.query.fileName}`);

    const file = `${__dirname}/${req.query.fileName}`;
    serverRouteDownloadLog(`req.query.fileName :: ${req.query.fileName}`);

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
    serverRouteLog(`upload :: ${describer} :: ${value}`);
}

function serverRouteDownloadLog(describer, value) {
    serverRouteLog(`download :: ${describer} :: ${value}`);
}

function serverLog(message) {
    console.log(`server :: ${message}`);
}

function serverRouteLog(route) {
    serverLog(`route :: ${route}`);
}