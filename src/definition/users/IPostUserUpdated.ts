import { IHttp, IModify, IPersistence, IRead } from '../accessors';
import { AppMethod } from '../metadata';
import { IUserUpdateContext } from './IUserUpdateContext';

/**
 * Event interface that allows an app to
 * register as a handler of the `IPostUserUpdated`
 * event
 *
 * This event is triggered *after* the
 * user has been saved to the database.
 */
export interface IPostUserUpdated {
    [AppMethod.EXECUTE_POST_USER_UPDATED](
        context: IUserUpdateContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void>;
}
