import { IMessageBuilder, INotifier } from '../../definition/accessors';
import { ITypingOptions, TypingScope } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { IMessageBridge, IUserBridge } from '../bridges';
import { MessageBuilder } from './MessageBuilder';

export class Notifier implements INotifier {
    constructor(
        private readonly userBridge: IUserBridge,
        private readonly msgBridge: IMessageBridge,
        private readonly appId: string,
    ) { }

    public async notifyUser(user: IUser, message: IMessage): Promise<void> {
        if (!message.sender || !message.sender.id) {
            const appUser = await this.userBridge.getAppUser(this.appId);

            message.sender = appUser;
        }

        await this.msgBridge.notifyUser(user, message, this.appId);
    }

    public async notifyRoom(room: IRoom, message: IMessage): Promise<void> {
        if (!message.sender || !message.sender.id) {
            const appUser = await this.userBridge.getAppUser(this.appId);

            message.sender = appUser;
        }

        await this.msgBridge.notifyRoom(room, message, this.appId);
    }

    public async typing(options: ITypingOptions): Promise<() => Promise<void>> {
        options.scope = options.scope || TypingScope.Room;

        if (!options.username) {
            const appUser = await this.userBridge.getAppUser(this.appId);
            options.username = appUser && appUser.name || '';
        }

        this.msgBridge.typing({ ...options, isTyping: true });

        return () => this.msgBridge.typing({ ...options, isTyping: false });
    }

    public getMessageBuilder(): IMessageBuilder {
        return new MessageBuilder();
    }
}
