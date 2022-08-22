import { ILivechatMessage } from '../livechat';
import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { BlockBuilder } from '../uikit';
import { AppVideoConference } from '../videoConferences';
import { IDiscussionBuilder } from './IDiscussionBuilder';
import { ILivechatCreator } from './ILivechatCreator';
import { ILivechatMessageBuilder } from './ILivechatMessageBuilder';
import { IMessageBuilder } from './IMessageBuilder';
import { IRoomBuilder } from './IRoomBuilder';
import { IUploadCreator } from './IUploadCreator';
import { IVideoConferenceBuilder } from './IVideoConferenceBuilder';

export interface IModifyCreator {
    /**
     * Get the creator object responsible for the
     * Livechat integrations
     */
    getLivechatCreator(): ILivechatCreator;

    /**
     * Get the creator object responsible for the upload.
     */
    getUploadCreator(): IUploadCreator;

    /**
     * @deprecated please prefer the rocket.chat/ui-kit components
     *
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
     * Starts the process for building a new video conference.
     *
     * @param data (optional) the initial data to pass into the builder,
     * @return an IVideoConferenceBuilder instance
     */
    startVideoConference(data?: Partial<AppVideoConference>): IVideoConferenceBuilder;

    /**
     * Finishes the creating process, saving the object to the database.
     *
     * @param builder the builder instance
     * @return the resulting `id` of the resulting object
     */
    finish(builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder | IDiscussionBuilder | IVideoConferenceBuilder): Promise<string>;
}
