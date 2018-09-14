import { IMessage } from '../messages';
import { IUser } from '../users';

export interface INotification {
    message: string;
    customFields?: { [key: string]: any };
    readonly triggerMessage: IMessage;
    readonly sender: IUser;
    readonly receiver: IUser;
}
