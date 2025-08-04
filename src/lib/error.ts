// Refactored from old/src/server/error.js for TypeScript and ES module usage.

export class CustomError {
    description: string;
    constructor(description: string) {
        this.description = description;
    }
}

export class ErrorList {
    private static instance: ErrorList;
    private errors: any[] = [];

    private constructor() {}

    public static getInstance(): ErrorList {
        if (!ErrorList.instance) {
            ErrorList.instance = new ErrorList();
        }
        return ErrorList.instance;
    }

    public getAll(): any[] {
        return this.errors;
    }

    addError(description: string) {
        const error = new CustomError(description);
        console.log(error.description);
        this.errors.push(error);
    }

    clearErrors() {
        this.errors = [];
    }
}
