import { IUser } from '../users';
import { RoomType } from './RoomType';

export interface IRoom {
    id: string;
    displayName?: string;
    slugifiedName: string;
    type: RoomType;
    creator: IUser;
    /**
     * @deprecated
     */
    usernames: Array<string>;
    isDefault?: boolean;
    isReadOnly?: boolean;
    displaySystemMessages?: boolean;
    messageCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    lastModifiedAt?: Date;
    customFields?: { [key: string]: any };
}

export class Room implements IRoom {
    public id: string;
    public displayName?: string;
    public slugifiedName: string;
    public type: RoomType;
    public creator: IUser;
    public isDefault?: boolean;
    public isReadOnly?: boolean;
    public displaySystemMessages?: boolean;
    public messageCount?: number;
    public createdAt?: Date;
    public updatedAt?: Date;
    public lastModifiedAt?: Date;
    public customFields?: { [key: string]: any };
    private _USERNAMES: Array<string>;
    /**
     * @deprecated
     */
    public get usernames(): Array<string> {
        // Get usernames
        console.log('getUsernames');
        return this._USERNAMES;
    }

    public set usernames(usernames) {
        return;
    }

    public constructor(room: IRoom) {
        Object.assign(this, room);
    }
}
