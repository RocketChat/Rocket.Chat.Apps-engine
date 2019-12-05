import { IUserCreation } from '../users';

export interface IUserCreator {
    /**
     * Creates an app user.
     * @param data the essential data for creating a user
     */
    createAppUser(data: IUserCreation): Promise<string>;
}
