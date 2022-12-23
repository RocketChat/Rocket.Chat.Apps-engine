import type { ILivechatMessage } from '../livechat';
import type { IMessage } from '../messages';
import type { IRoom } from '../rooms';
import type { BlockBuilder } from '../uikit';
import type { AppVideoConference } from '../videoConferences';
import type { IDiscussionBuilder } from './IDiscussionBuilder';
import type { ILivechatCreator } from './ILivechatCreator';
import type { ILivechatMessageBuilder } from './ILivechatMessageBuilder';
import type { IMessageBuilder } from './IMessageBuilder';
import type { IRoomBuilder } from './IRoomBuilder';
import type { IUploadCreator } from './IUploadCreator';
import type { IVideoConferenceBuilder } from './IVideoConferenceBuilder';

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
	finish(
		builder: IMessageBuilder | ILivechatMessageBuilder | IRoomBuilder | IDiscussionBuilder | IVideoConferenceBuilder,
	): Promise<string>;
}
