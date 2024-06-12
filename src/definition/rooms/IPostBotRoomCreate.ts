import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { IRoom } from './IRoom';

/** Handler for after a dm room with Bot is created. */
export interface IPostBotRoomCreate {
    /**
     * Method called *after* the room has been created.
     *
     * @param room The room which was created
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    executePostBotRoomCreate(room: IRoom, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void>;
}
