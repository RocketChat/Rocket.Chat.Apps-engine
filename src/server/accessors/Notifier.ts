import { INotifier } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { AppBridges } from '../bridges';

export class Notifier implements INotifier {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public notifyUser(user: IUser, message: IMessage): void {
        this.bridges.getMessageBridge().notifyUser(user, message, this.appId);
    }

    public notifyRoom(room: IRoom, message: IMessage): void {
        this.bridges.getMessageBridge().notifyRoom(room, message, this.appId);
    }
}
