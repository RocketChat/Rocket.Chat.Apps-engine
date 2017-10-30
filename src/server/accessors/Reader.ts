import {
    IEnvironmentRead,
    IMessageRead,
    IPersistenceRead,
    IRead,
    IRoomRead,
    IUserRead,
} from 'temporary-rocketlets-ts-definition/accessors';

export class Reader implements IRead {
    constructor(private env: IEnvironmentRead, private message: IMessageRead,
                private persist: IPersistenceRead, private room: IRoomRead,
                private user: IUserRead) { }

    public getEnvironmentReader(): IEnvironmentRead {
        return this.env;
    }

    public getMessageReader(): IMessageRead {
        return this.message;
    }

    public getPersistenceReader(): IPersistenceRead {
        return this.persist;
    }

    public getRoomReader(): IRoomRead {
        return this.room;
    }

    public getUserReader(): IUserRead {
        return this.user;
    }
}
