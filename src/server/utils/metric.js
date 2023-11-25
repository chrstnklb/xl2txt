class Metric {

    constructor() {
        this.timestamp = '';
        this.colCount = 0;
        this.rowCount = 0;
        this.calculationTimeInMs = 0;
    }

    getTimestamp() {
        return this.timestamp;
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
