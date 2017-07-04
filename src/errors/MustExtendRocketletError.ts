export class MustExtendRocketletError extends Error {
    constructor() {
        super('Rocketlet must extend the "Rocketlet" abstract class.');
    }
}
