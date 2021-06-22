export abstract class AppSourceStorage {
    public abstract create(path: string, zip: Buffer): Promise<boolean>;
    public abstract retrieveOne(path: string): Promise<Buffer>;
    public abstract update(id: string, zip: Buffer): Promise<boolean>;
    public abstract remove(id: string): Promise<boolean>;
}
