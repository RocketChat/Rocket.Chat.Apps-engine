import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IMessageAttachment } from './IMessageAttachment';

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
    customFields?: { [key: string]: any };
}
