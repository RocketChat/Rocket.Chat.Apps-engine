import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IBlockitAction } from './IBlockitAction';
import { IBlockitResponse } from './IBlockitResponse';

/** Handler for after a message is sent. */
export interface IBlockitActionHandler {
    /**
     * Method called *after* the message is sent to the other clients.
     *
     * @param data
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    [AppMethod.BLOCKIT_ACTION](data: IBlockitAction, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IBlockitResponse>;
}
