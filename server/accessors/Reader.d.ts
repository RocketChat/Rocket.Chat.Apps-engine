import { IEnvironmentRead, IMessageRead, INotifier, IPersistenceRead, IRead, IRoomRead, IUserRead } from '../../definition/accessors';
export declare class Reader implements IRead {
    private env;
    private message;
    private persist;
    private room;
    private user;
    private noti;
    constructor(env: IEnvironmentRead, message: IMessageRead, persist: IPersistenceRead, room: IRoomRead, user: IUserRead, noti: INotifier);
    getEnvironmentReader(): IEnvironmentRead;
    getMessageReader(): IMessageRead;
    getPersistenceReader(): IPersistenceRead;
    getRoomReader(): IRoomRead;
    getUserReader(): IUserRead;
    getNotifier(): INotifier;
}
