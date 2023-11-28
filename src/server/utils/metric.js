const fileHandler = require('./fileHandler.js');
const path = require('path');
const time = require('./time.js');
const Timer = require('./timer.js'); 

class Metric {

    constructor() {
        this.timestamp = '';
        this.colCount = 0;
        this.rowCount = 0;
        this.calculationTimeInMs = 0;
        Timer.startTimer();
    }

    writeMetric() {
        Timer.endTimer()
        this.setCalculationTimeInMs(Timer.endTimer());

        let folder = path.join(__dirname, '../../exchange/metrics/');
        let filename = 'metric-' + this.getTimestamp() + '.json';
        let data = JSON.stringify(this.getMetricObject());

        console.log('Writing metric to file: ' + folder + filename);
        fileHandler.writeToFile(folder, filename, data);
        console.log('Writing metric to file: ' + folder + filename + ' done!');
    }

    getMetricObject() {
        return {
            timestamp: this.getTimestamp(),
            colCount: this.getColCount(),
            rowCount: this.getRowCount(),
            calculationTimeInMs: this.getCalculationTimeInMs()
        }
    }

    getTimestamp() {
        return time.getActualTimeStampYYYYMMDDhhmmss();
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    getColCount() {
        return this.colCount;
    }

    setColCount(colCount) {
        this.colCount = colCount;
    }

    getRowCount() {
        return this.rowCount;
    }

    setRowCount(rowCount) {
        this.rowCount = rowCount;
    }

    getCalculationTimeInMs() {
        return this.calculationTimeInMs;
    }

    setCalculationTimeInMs(calculationTimeInMs) {
        this.calculationTimeInMs = calculationTimeInMs;
    }
}
  
module.exports = Metric;
