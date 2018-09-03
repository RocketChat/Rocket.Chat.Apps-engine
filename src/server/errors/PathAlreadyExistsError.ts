export class PathAlreadyExistsError implements Error {
    public name: string = 'PathAlreadyExists';
    public message: string;

    constructor(path: string) {
        this.message = `The webhook path "${path}" already exists in the system.`;
    }
}
