import { IRoomExtender } from "@rocket.chat/apps-engine/definition/accessors/IRoomExtender.ts";
import { RocketChatAssociationModel } from "@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.ts";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms/IRoom.ts";
import { IUser } from "@rocket.chat/apps-engine/definition/users/IUser.ts";

export class RoomExtender implements IRoomExtender {
    public kind: RocketChatAssociationModel.ROOM;

    private members: Array<IUser>;

    constructor(private room: IRoom) {
        this.kind = RocketChatAssociationModel.ROOM;
        this.members = [];
    }

    public addCustomField(key: string, value: unknown): IRoomExtender {
        if (!this.room.customFields) {
            this.room.customFields = {};
        }

        if (this.room.customFields[key]) {
            throw new Error(`The room already contains a custom field by the key: ${key}`);
        }

        if (key.includes('.')) {
            throw new Error(`The given key contains a period, which is not allowed. Key: ${key}`);
        }

        this.room.customFields[key] = value;

        return this;
    }

    public addMember(user: IUser): IRoomExtender {
        if (this.members.find((u) => u.username === user.username)) {
            throw new Error('The user is already in the room.');
        }

        this.members.push(user);

        return this;
    }

    public getMembersBeingAdded(): Array<IUser> {
        return this.members;
    }

    public getUsernamesOfMembersBeingAdded(): Array<string> {
        return this.members.map((u) => u.username);
    }

    public getRoom(): IRoom {
        return structuredClone(this.room);
    }
}
