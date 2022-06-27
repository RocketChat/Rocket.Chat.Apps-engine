export class VideoConfProviderAlreadyExistsError implements Error {
    public name: string = 'VideoConfProviderAlreadyExists';
    public message: string;

    constructor(name: string) {
        this.message = `The video conference provider "${name}" was already registered by another App.`;
    }
}
