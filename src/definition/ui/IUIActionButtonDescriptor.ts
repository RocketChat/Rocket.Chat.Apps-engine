import type { UIActionButtonContext } from './UIActionButtonContext';

export enum RoomTypeFilter {
	PUBLIC_CHANNEL = 'public_channel',
	PRIVATE_CHANNEL = 'private_channel',
	PUBLIC_TEAM = 'public_team',
	PRIVATE_TEAM = 'private_team',
	PUBLIC_DISCUSSION = 'public_discussion',
	PRIVATE_DISCUSSION = 'private_discussion',
	DIRECT = 'direct',
	DIRECT_MULTIPLE = 'direct_multiple',
	LIVE_CHAT = 'livechat',
}

export enum MessageActionContext {
	MESSAGE = 'message',
	MESSAGE_MOBILE = 'message-mobile',
	THREADS = 'threads',
	STARRED = 'starred',
}

export interface IUActionButtonWhen {
	roomTypes?: Array<RoomTypeFilter>;
	messageActionContext?: Array<MessageActionContext>;
	hasOnePermission?: Array<string>;
	hasAllPermissions?: Array<string>;
	hasOneRole?: Array<string>;
	hasAllRoles?: Array<string>;
}

export interface IUIActionButtonDescriptor {
	actionId: string;
	labelI18n: string;
	context: UIActionButtonContext;
	when?: IUActionButtonWhen;
}
export interface IUIActionButton extends IUIActionButtonDescriptor {
	appId: string;
}
