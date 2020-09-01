import { IRoom } from '../rooms';
import { IUser } from '../users';

/**
 * This interface represents a user's subscription to
 * a room and includes information about that user's
 * settings and information in relation to the room.
 */
export interface IRoomSubscription {
    /** The id of the subscription (maps to `_id`). */
    id: string;
    /** The room the subscription is for (kinda maps to `rid`). */
    room: IRoom;
    /** The user the subscription is for (kinda maps to `u`). */
    user: IUser;
    /** Whether the room the subscription is for is hidden from the UI (maps to `open`). */
    isHidden: boolean;
    /** Whether the subscription has an alert or notification for the user (maps to `alert`). */
    hasAlert: boolean;
    /** The actual number to display on the room's list; it is the sum of userMentionsCount and groupMentionsCount (maps to `unread`). */
    unreadCount: number;
    /** The number of times the user has been mentioned (maps to `userMentions`). */
    userMentionsCount: number;
    /** The number of times the groups a user is part of has been mentioned (maps to `groupMentions`). */
    groupMentionsCount: number;
    /** The date when the subscription was created (maps to `ts`). */
    createdAt: Date;
    /** The date when the subscription was last updated (maps to `_updatedAt`). */
    updatedAt?: Date;
    /** The last date/time the subscription was seen or marked as read (maps to `ls`). */
    lastSeenAt?: Date;
}
