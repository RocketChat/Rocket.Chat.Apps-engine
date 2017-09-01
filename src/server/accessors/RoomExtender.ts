import { IRoomExtender } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationModel } from 'temporary-rocketlets-ts-definition/metadata';
import { IRoom } from 'temporary-rocketlets-ts-definition/rooms';
import { IUser } from 'temporary-rocketlets-ts-definition/users';

export class RoomExtender implements IRoomExtender {
    public kind: RocketChatAssociationModel.ROOM;

    constructor(private room: IRoom) {
        this.kind = RocketChatAssociationModel.ROOM;
    }

    public addCustomField(key: string, value: any): IRoomExtender {
        if (this.room.customFields[key]) {
            throw new Error(`The room already contains a custom field by the key: ${ key }`);
        }

        this.room.customFields[key] = value;

        return this;
    }

    public addMember(user: IUser): IRoomExtender {
        this.room.usernames.push(user.username);

        return this;
    }

    public getRoom(): IRoom {
        return Object.create(this.room);
    }
}
