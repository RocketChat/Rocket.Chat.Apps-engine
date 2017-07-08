export class MustContainFunctionError implements Error {
    public name: string = 'MustContainFunction';
    public message: string;

    constructor(fileName: string, funcName: string) {
        this.message = `The Rocketlet (${fileName}) doesn't have a "${funcName}" function which is required.`;
    }
}
