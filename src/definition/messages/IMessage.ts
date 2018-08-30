import { IRoom } from '../rooms';
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
    customFields?: { [key: string]: any };
}
