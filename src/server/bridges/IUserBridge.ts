import { IUser, IUserCreationOptions } from '../../definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;

    getByUsername(username: string, appId: string): Promise<IUser>;

    getAppUser(appId?: string): Promise<IUser | undefined>;

    getActiveUserCount(): Promise<number>;

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

    /**
     * Updates a user.
     *
     * Note: the actual methods used by apps to update
     * user properties are much more granular, but at a
     * bridge level we can adopt a more practical approach
     * since it is only accessible internally by the framework
     *
     * @param user the user to be updated
     * @param updates a map of properties to be updated
     * @param appId the id of the app executing the call
     */
    update(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean>;
}
