import { IMessageBuilder, INotifier } from '@rocket.chat/apps-ts-definition/accessors';
import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

import { AppBridges } from '../bridges';
import { MessageBuilder } from './MessageBuilder';

export class Notifier implements INotifier {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public async notifyUser(user: IUser, message: IMessage): Promise<void> {
        await this.bridges.getMessageBridge().notifyUser(user, message, this.appId);
    }

    public async notifyRoom(room: IRoom, message: IMessage): Promise<void> {
        await this.bridges.getMessageBridge().notifyRoom(room, message, this.appId);
    }

    public getMessageBuilder(): IMessageBuilder {
        return new MessageBuilder();
    }
}
