import { IRoom, RoomType } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { AppManager } from '../AppManager';

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
        if (!this._USERNAMES) {
            this._USERNAMES = this.manager.getBridges().getInternalBridge().getUsernamesOfRoomById(this.id);
        }

        return this._USERNAMES;
    }

    public set usernames(usernames) {
        return;
    }

    public constructor(room: IRoom, private manager: AppManager) {
        Object.assign(this, room);
    }
}
