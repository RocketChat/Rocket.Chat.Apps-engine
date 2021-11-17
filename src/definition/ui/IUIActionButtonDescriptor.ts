import { UIActionButtonContext } from './UIActionButtonContext';

// Temporary filter for RoomType
export enum TemporaryRoomTypeFilter {
    GROUP = 'group',
    CHANNEL = 'channel',
    LIVE_CHAT = 'livechat',
    TEAM = 'team',
    DIRECT = 'direct',
    DIRECT_MULTIPLE = 'direct_multiple',
}

export enum MessageActionContext {
    MESSAGE = 'message',
    MESSAGE_MOBILE = 'message-mobile',
    THREADS = 'threads',
    STARRED = 'starred',
}

export interface IUIActionButtonDescriptor {
    actionId: string;
    nameI18n: string;
    hintI18n: string;
    context: UIActionButtonContext;
    // Suggestions for possible icons?
    icon?: string;
    when?: {
        roomTypes?: Array<TemporaryRoomTypeFilter>;
        messageActionContext?: Array<MessageActionContext>;
        // How do we provide suggestions for permissions?
        hasOnePermission?: Array<string>;
        hasAllPermissions?: Array<string>;
        // How do we provide suggestions for roles?
        hasOneRole?: Array<string>;
        hasAllRoles?: Array<string>;
    };
}

export interface IUIActionButton extends IUIActionButtonDescriptor {
    appId: string;
}
