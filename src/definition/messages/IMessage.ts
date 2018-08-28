import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IMessageAttachment } from './IMessageAttachment';
import { IMessageReaction } from './IMessageReaction';
import { IMessageAction } from './IMessageAction';

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
    reactions?: { [key: string]: Array<IMessageReaction> };
    actions?: Array<IMessageAction>;
    customFields?: { [key: string]: any };
}
