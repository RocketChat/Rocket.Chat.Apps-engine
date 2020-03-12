export enum UIKitContextualBarType {
    ROOM_THREADS = 'room.threads',
    ROOM_SEARCH_MESSAGES = 'room.search-messages',
    ROOM_USER_INFO = 'room.user-info',
    ROOM_MEMBERS_LIST = 'room.members-list',
    ROOM_MORE =  'room.more',
}

export interface IUIKitContextualBar {
    id: string;
    type: UIKitContextualBarType;
    state?: object;
}
