import { ILivechatMessage } from '../livechat';
import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { ILivechatCreator } from './ILivechatCreator';
import { ILivechatMessageBuilder } from './ILivechatMessageBuilder';
import { IMessageBuilder } from './IMessageBuilder';
import { IRoomBuilder } from './IRoomBuilder';
import { IUserCreator } from './IUserCreator';

export interface IModifyCreator {
    /**
     * Get the creator object responsible for the
     * Livechat integrations
     */
    getLivechatCreator(): ILivechatCreator;

    /**
     * Gets the creator responsible for creating a user.
     */
    getUserCreator(): IUserCreator;

    /**
     * Starts the process for building a new message object.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IMessageBuilder instance
     */
    startMessage(data?: IMessage): IMessageBuilder;

    /**
     * Starts the process for building a new livechat message object.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IMessageBuilder instance
     */
    startLivechatMessage(data?: ILivechatMessage): ILivechatMessageBuilder;

    /**
     * Starts the process for building a new room.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IRoomBuilder instance
     */
    startRoom(data?: IRoom): IRoomBuilder;

    /**
     * Finishes the creating process, saving the object to the database.
     *
     * @param builder the builder instance
     * @return the resulting `id` of the resulting object
     */
    finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder): Promise<string>;
}
