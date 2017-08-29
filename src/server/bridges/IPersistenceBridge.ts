export interface IPersistenceBridge {
    create(data: object, rocketletId: string): string;
    readById(id: string, rocketletId: string): object;
}
