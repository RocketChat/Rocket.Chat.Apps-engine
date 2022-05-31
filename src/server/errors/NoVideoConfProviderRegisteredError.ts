export class NoVideoConfProviderRegisteredError implements Error {
    public name = 'NoVideoConfProviderRegistered';
    public message = 'There are no video conference providers registered in the system.';
}
