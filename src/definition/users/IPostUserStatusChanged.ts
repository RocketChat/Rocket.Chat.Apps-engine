import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IUserStatusContext } from './IUserStatusContext';

/**
 * Event interface that allows an app to
 * register as a handler of the `IPostUserStatusChanged`
 * event
 *
 * This event is triggered *after* the
 * user changes his status on Rocket.chat
 */
export interface IPostUserStatusChanged {
    [AppMethod.EXECUTE_POST_USER_STATUS_CHANGED](
        context: IUserStatusContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void>;
}
