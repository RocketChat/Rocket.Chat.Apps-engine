import { ILivechatMessage } from '../livechat';
import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { BlockBuilder } from '../uikit';
import { IDiscussionBuilder } from './IDiscussionBuilder';
import { ILivechatCreator } from './ILivechatCreator';
import { ILivechatMessageBuilder } from './ILivechatMessageBuilder';
import { IMessageBuilder } from './IMessageBuilder';
import { IRoomBuilder } from './IRoomBuilder';

export interface IModifyCreator {
    /**
     * Get the creator object responsible for the
     * Livechat integrations
     */
    getLivechatCreator(): ILivechatCreator;

    /**
     * Gets a new instance of a BlockBuilder
     */
    getBlockBuilder(): BlockBuilder;
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
     * Starts the process for building a new discussion.
     *
     * @param data (optional) the initial data to pass into the builder,
     *          the `id` property will be ignored
     * @return an IDiscussionBuilder instance
     */
    startDiscussion(data?: Partial<IRoom>): IDiscussionBuilder;

    /**
     * Finishes the creating process, saving the object to the database.
     *
     * @param builder the builder instance
     * @return the resulting `id` of the resulting object
     */
    finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder | IDiscussionBuilder): Promise<string>;
}
