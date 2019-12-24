import { IMessageBuilder, INotifier } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';

import { IMessageBridge } from '../bridges';
import { MessageBuilder } from './MessageBuilder';

export class Notifier implements INotifier {
    constructor(private readonly msgBridge: IMessageBridge, private readonly appId: string) { }

    public async notifyUser(user: IUser, message: IMessage): Promise<void> {
        await this.msgBridge.notifyUser(user, message, this.appId);
    }

    public async notifyRoom(room: IRoom, message: IMessage): Promise<void> {
        await this.msgBridge.notifyRoom(room, message, this.appId);
    }

    public getMessageBuilder(): IMessageBuilder {
        return new MessageBuilder(this.appId);
    }
}
