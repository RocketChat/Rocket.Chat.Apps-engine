export interface IPersistenceBridge {
    create(data: object, rocketletId: string): string;
}
