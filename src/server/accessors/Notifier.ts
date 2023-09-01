import { IMessageBuilder, INotifier } from '../../definition/accessors';
import { ITypingOptions, TypingScope } from '../../definition/accessors/INotifier';
import { IMessage } from '../../definition/messages';
import { IRoom, RoomType } from '../../definition/rooms';
import { IUser } from '../../definition/users';
import { MessageBridge, RoomBridge, UserBridge } from '../bridges';
import { MessageBuilder } from './MessageBuilder';

export class Notifier implements INotifier {
    constructor(
        private readonly userBridge: UserBridge,
        private readonly msgBridge: MessageBridge,
        private readonly roomBridge: RoomBridge,
        private readonly appId: string,
    ) {}

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

    /**
     * Sends a direct message to a user.
     *
     * @param {IUser} user - The user to send the message to.
     * @param {IMessage} partialMsg - The partial message to send.
     * @returns {Promise<void>} A Promise that resolves when the message has been sent.
     */
    public async notifyDM(user: IUser, partialMsg: Omit<IMessage, 'room'>): Promise<void> {
        const sender = partialMsg.sender || (await this.userBridge.doGetAppUser(this.appId));
        const dmRoom = (await this.roomBridge.doGetDirectByUsernames([user.username, sender.username], this.appId)) || (await this.createDMRoom(user, sender));

        const message: IMessage = {
            ...partialMsg,
            room: dmRoom,
            sender,
        };

        await this.msgBridge.doCreate(message, this.appId);
    }

    public async typing(options: ITypingOptions): Promise<() => Promise<void>> {
        options.scope = options.scope || TypingScope.Room;

        if (!options.username) {
            const appUser = await this.userBridge.doGetAppUser(this.appId);
            options.username = (appUser && appUser.name) || '';
        }

        this.msgBridge.doTyping({ ...options, isTyping: true }, this.appId);

        return () => this.msgBridge.doTyping({ ...options, isTyping: false }, this.appId);
    }

    public getMessageBuilder(): IMessageBuilder {
        return new MessageBuilder();
    }

    /**
     * Creates a new direct message room between two users.
     *
     * @param {IUser} user - The first user to create the room for.
     * @param {IUser} sender - The second user to create the room for.
     * @returns {Promise<IRoom>} A Promise that resolves with the newly created direct message room.
     */
    private async createDMRoom(user: IUser, sender: IUser): Promise<IRoom> {
        const newDMRId = await this.roomBridge.doCreate(
            {
                type: RoomType.DIRECT_MESSAGE,
                usernames: [user.username, sender.username],
                creator: sender,
                id: '',
                slugifiedName: '',
            },
            [user.username, sender.username],
            this.appId,
        );

        return this.roomBridge.doGetById(newDMRId, this.appId);
    }
}
