import * as fileHandler from './fileHandler';
import path from 'path';
import * as time from './time';
import { Timer } from './timer';

export class Metric {
    timestamp: string = '';
    colCount: number = 0;
    rowCount: number = 0;
    calculationTimeInMs: number = 0;

    constructor() {
        Timer.startTimer();
    }

    writeMetric() {
        Timer.endTimer();
        this.setCalculationTimeInMs(Timer.endTimer());
        const folder = path.join(__dirname, '../../exchange/metrics/');
        const filename = 'metric-' + this.getTimestamp() + '.json';
        const data = JSON.stringify(this.getMetricObject());
        fileHandler.writeToFile(folder, filename, data);
    }

    getMetricObject() {
        return {
            timestamp: this.getTimestamp(),
            colCount: this.getColCount(),
            rowCount: this.getRowCount(),
            calculationTimeInMs: this.getCalculationTimeInMs(),
        };
    }

    getTimestamp() {
        return time.getActualTimeStampYYYYMMDDhhmmss();
    }
    setTimestamp(timestamp: string) {
        this.timestamp = timestamp;
    }
    getColCount() {
        return this.colCount;
    }
    setColCount(colCount: number) {
        this.colCount = colCount;
    }
    getRowCount() {
        return this.rowCount;
    }
    setRowCount(rowCount: number) {
        this.rowCount = rowCount;
    }
    getCalculationTimeInMs() {
        return this.calculationTimeInMs;
    }
    setCalculationTimeInMs(calculationTimeInMs: number) {
        this.calculationTimeInMs = calculationTimeInMs;
    }
}
