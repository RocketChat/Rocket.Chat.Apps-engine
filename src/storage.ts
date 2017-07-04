export abstract class RocketletStorage {
    public abstract create(): void;
    public abstract retrieveOne(): void;
    public abstract retrieveAll(): void;
    public abstract update(): void;
    public abstract remove(): void;
}
