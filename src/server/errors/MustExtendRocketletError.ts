export class MustExtendRocketletError implements Error {
    public name: string = 'MustExtendRocketlet';
    public message: string = 'Rocketlet must extend the "Rocketlet" abstract class.';
}
