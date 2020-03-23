import { IHttp, IPersistence, IRead } from '../accessors';
import { IUser } from './IUser';

/** Handler for after a user is created. */
export interface IPostUserCreated {
    /**
     * Method called *after* the user has been created.
     *
     * @param user The user which was created
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    executePostUserCreated(user: IUser, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
