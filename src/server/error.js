/**
 * Represents a custom error with a description and an Excel cell.
 */
class CustomError {
    /**
     * Creates a new CustomError instance.
     * @param {string} description - Description of the error.
     */
    constructor(description) {
        this.description = description;
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
     * @param {string} description - Description of the error.
    */
    addError(description) {
        const error = new CustomError(description);
        console.log(error.description);
        this.errors.push(error);
    }

    /**
     * Clears the list of errors.
     */
    clearErrors() {
        this.errors = [];
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
