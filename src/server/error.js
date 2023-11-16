
/**
 * @typedef {Object} ExcelCell
 * @property {string} sheetName - The name of the sheet where the error occurred.
 * @property {string} cellAddress - The address of the cell where the error occurred.
 */

/**
 * Represents a custom error with a description and an Excel cell.
 * @extends Error
 */
class CustomError extends Error {
    /**
     * Creates a new CustomError instance.
     * @param {string} description - The description of the error.
     * @param {ExcelCell} excelCell - The Excel cell where the error occurred.
     */
    constructor(description, excelCell) {
        super(description);
        this.excelCell = excelCell;
    }
}

/**
 * Represents a list of errors.
 */
class ErrorList {
    /**
     * Creates a new ErrorList instance.
     */
    constructor() {
        /** @type {CustomError[]} */
        this.errors = [];
    }

    /**
     * Adds a new error to the list.
     * @param {string} description - The description of the error.
     * @param {ExcelCell} excelCell - The Excel cell where the error occurred.
     */
    addError(description, excelCell) {
        const error = new CustomError(description, excelCell);
        this.errors.push(error);
    }

    /**
     * Returns the singleton instance of ErrorList.
     * @returns {ErrorList} The singleton instance of ErrorList.
     */
    static getInstance() {
        if (!ErrorList.instance) {
            ErrorList.instance = new ErrorList();
        }
        return ErrorList.instance;
    }
}

// Create the singleton instance of ErrorList.
ErrorList.instance = null;

module.exports = ErrorList.getInstance();
