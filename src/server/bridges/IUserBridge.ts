import { IUser, IUserCreationOptions } from '../../definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;

    getByUsername(username: string, appId: string): Promise<IUser>;

    getAppUser(appId: string): Promise<IUser | undefined>;

    /**
     * Creates a user.
     * @param data the essential data for creating a user
     * @param appId the id of the app calling this
     * @param options options for passing extra data
     */
    create(data: Partial<IUser>, appId: string, options?: IUserCreationOptions): Promise<string>;

    /**
     * Remove a user.
     *
     * @param user the user object to be removed
     * @param appId the id of the app executing the call
     */
    remove(user: IUser, appId: string): Promise<boolean>;

    getActiveUserCount(): Promise<number>;
}
