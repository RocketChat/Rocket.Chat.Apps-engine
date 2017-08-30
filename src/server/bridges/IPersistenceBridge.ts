export interface IPersistenceBridge {
    create(data: any, rocketletId: string): string;
    readById(id: string, rocketletId: string): any;
}
