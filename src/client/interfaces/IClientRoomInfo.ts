import { IClientUserInfo } from './IClientUserInfo';

/**
 * Represents the room's information returned to the
 * external component.
 */
export interface IClientRoomInfo {
    /**
     * the id of the Rocket.Chat room
     */
    roomId: string;
    /**
     * the room name of the Rocket.Chat room
     */
    roomName: string;
    /**
     * the list that contains all the users belonging
     * to this room.
     */
    members: Array<IClientUserInfo>;
}
