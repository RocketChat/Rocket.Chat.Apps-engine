import { IUser } from '../users';
import { IMessage } from '../messages';

export interface INotification {
    message: string;

    triggerMessage: IMessage;

    sender: IUser;

    receiver: IUser;
}
