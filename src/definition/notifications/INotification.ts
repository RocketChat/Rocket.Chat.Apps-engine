import { IMessage } from '../messages';
import { IUser } from '../users';

export interface INotification {
    message: string;

    triggerMessage: IMessage;

    sender: IUser;

    receiver: IUser;
}
