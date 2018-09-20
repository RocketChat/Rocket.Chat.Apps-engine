export class PathAlreadyExistsError implements Error {
    public name: string = 'PathAlreadyExists';
    public message: string;

    constructor(path: string) {
        this.message = `The api path "${path}" already exists in the system.`;
    }
}
