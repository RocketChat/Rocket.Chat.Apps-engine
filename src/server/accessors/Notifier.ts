import { IMessageBuilder, INotifier } from '../../definition/accessors';
import { ITypingOptions, TypingScope } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { MessageBridge, UserBridge } from '../bridges';
import { MessageBuilder } from './MessageBuilder';

export class Notifier implements INotifier {
    constructor(
        private readonly userBridge: UserBridge,
        private readonly msgBridge: MessageBridge,
        private readonly appId: string,
    ) { }

    public async notifyUser(user: IUser, message: IMessage): Promise<void> {
        if (!message.sender || !message.sender.id) {
            const appUser = await this.userBridge.doGetAppUser(this.appId);

            message.sender = appUser;
        }

        await this.msgBridge.doNotifyUser(user, message, this.appId);
    }

    public async notifyRoom(room: IRoom, message: IMessage): Promise<void> {
        if (!message.sender || !message.sender.id) {
            const appUser = await this.userBridge.doGetAppUser(this.appId);

            message.sender = appUser;
        }

        await this.msgBridge.doNotifyRoom(room, message, this.appId);
    }

    public async typing(options: ITypingOptions): Promise<() => Promise<void>> {
        options.scope = options.scope || TypingScope.Room;

        if (!options.username) {
            const appUser = await this.userBridge.doGetAppUser(this.appId);
            options.username = appUser && appUser.name || '';
        }

        this.msgBridge.doTyping({ ...options, isTyping: true }, this.appId);

        return () => this.msgBridge.doTyping({ ...options, isTyping: false }, this.appId);
    }

    public getMessageBuilder(): IMessageBuilder {
        return new MessageBuilder();
    }
}
