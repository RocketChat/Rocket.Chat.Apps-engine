export class AVideoConfProviderAlreadyExistsError implements Error {
    public name = 'AVideoConfProviderAlreadyExists';
    public message = 'A video conference provider is already registered in the system.';
}
