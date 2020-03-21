import { IHttp, IPersistence, IRead } from '../accessors';
import { IUser } from '.';
import { IRoom } from '../rooms';

/**  Handler which is called to determine whether a user is allowed to send a message or not. */
export interface IPreUserJoinRoomPrevent {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for the message
     * about to be sent.
     *
     * @param user The user which is being joined
     * @param room The room the room
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the prevent or not
     */
    checkPreUserJoinPrevent?(user: IUser, room: IRoom ,read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method which is to be used to prevent a message from being sent.
     *
     * @param user The user which is being joined
     * @param room The room the room
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence storage
     * @returns whether to prevent the message from being sent
     */
    executePreUserJoinPrevent(user: IUser, room: IRoom, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean>;
}
