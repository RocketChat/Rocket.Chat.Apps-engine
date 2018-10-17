import { IRoom, Room } from '../rooms';
import { IUser } from '../users';
import { IMessageAttachment } from './IMessageAttachment';
import { IMessageReactions } from './IMessageReaction';

export interface IMessage {
    id?: string;
    room: IRoom;
    sender: IUser;
    text?: string;
    createdAt?: Date;
    updatedAt?: Date;
    editor?: IUser;
    editedAt?: Date;
    emoji?: string;
    avatarUrl?: string;
    alias?: string;
    attachments?: Array<IMessageAttachment>;
    reactions?: IMessageReactions;
    groupable?: boolean;
    customFields?: { [key: string]: any };
}

export class Message implements IMessage {
    public id?: string;
    public sender: IUser;
    public text?: string;
    public createdAt?: Date;
    public updatedAt?: Date;
    public editor?: IUser;
    public editedAt?: Date;
    public emoji?: string;
    public avatarUrl?: string;
    public alias?: string;
    public attachments?: Array<IMessageAttachment>;
    public reactions?: IMessageReactions;
    public groupable?: boolean;
    public customFields?: { [key: string]: any };
    private _ROOM: Room;
    public get room(): Room {
        return this._ROOM;
    }
    public set room(room) {
        this._ROOM = new Room(room);
    }
    public constructor(message: IMessage) {
        Object.assign(this, message);
    }
}
