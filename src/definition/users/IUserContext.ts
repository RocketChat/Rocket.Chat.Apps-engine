import { IUser } from './IUser';

/**
 * The context of execution for the following events:
 * - IPostUserCreated
 * - IPostUserDeleted
 */
export interface IUserContext {
    /**
     * The user who has been affected
     * by the action
     */
    user: IUser;
    /**
     * The user who performed the
     * action. Null if it's the user himself
     */
    performedBy?: IUser;
}
