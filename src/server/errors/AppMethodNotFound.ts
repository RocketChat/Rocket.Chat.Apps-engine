export class AppMethodNotFound implements Error {
    public name = 'AppMethodNotFound';

    public message: string;

    constructor(message: string) {
        this.message = message;
    }
}
