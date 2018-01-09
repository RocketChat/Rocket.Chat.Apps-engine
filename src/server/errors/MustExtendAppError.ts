export class MustExtendAppError implements Error {
    public name: string = 'MustExtendApp';
    public message: string = 'App must extend the "App" abstract class.';
}
