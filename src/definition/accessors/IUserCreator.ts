import { IUser, IUserCreation } from '../users';

export interface IUserCreator {
    /**
     * Creates an app user.
     * @param user the basic information of the users
     */
    createAppUser(data: IUserCreation): Promise<IUser>;
}
