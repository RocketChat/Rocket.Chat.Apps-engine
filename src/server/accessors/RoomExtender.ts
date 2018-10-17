import { IRoomExtender } from '../../definition/accessors';
import { RocketChatAssociationModel } from '../../definition/metadata';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

import { Utilities } from '../misc/Utilities';

export class RoomExtender implements IRoomExtender {
    public kind: RocketChatAssociationModel.ROOM;

    constructor(private room: IRoom) {
        this.kind = RocketChatAssociationModel.ROOM;
    }

    public addCustomField(key: string, value: any): IRoomExtender {
        if (!this.room.customFields) {
            this.room.customFields = {};
        }

        if (this.room.customFields[key]) {
            throw new Error(`The room already contains a custom field by the key: ${ key }`);
        }

        this.room.customFields[key] = value;

        return this;
    }

    public addMember(user: IUser): IRoomExtender {
        // TODO:
        if (!Array.isArray(this.room.usernames)) {
            this.room.usernames = new Array<string>();
        }

        if (this.room.usernames.includes(user.username)) {
            throw new Error('The user is already in the room.');
        }

        this.room.usernames.push(user.username);

        return this;
    }

    public getRoom(): IRoom {
        return Utilities.deepClone(this.room);
    }
}
