export class MustContainFunctionError extends Error {
    constructor(fileName: string, funcName: string) {
        super(`The Rocketlet (${fileName}) doesn't have a "${funcName}" function which is required.`);
    }
}
