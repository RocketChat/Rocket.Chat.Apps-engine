export class ExternalComponentNotMatchWithAppError implements Error {
    public name: string = 'ExternalComponentNotMatchWithApp';
    public message: string;

    constructor() {
        this.message = 'The external component\'s appId does not match with the current app.';
    }
}
