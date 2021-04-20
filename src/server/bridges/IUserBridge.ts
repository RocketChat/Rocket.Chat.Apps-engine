import { IUser, IUserCreationOptions } from '../../definition/users';

export interface IUserBridge {
    doGetById(id: string, appId: string): Promise<IUser>;
    doGetByUsername(username: string, appId: string): Promise<IUser>;
    doGetAppUser(appId?: string): Promise<IUser | undefined>;
    doGetActiveUserCount(): Promise<number>;

    /**
     * Creates a user.
     * @param data the essential data for creating a user
     * @param appId the id of the app calling this
     * @param options options for passing extra data
     */
    doCreate(data: Partial<IUser>, appId: string, options?: IUserCreationOptions): Promise<string>;

    /**
     * Remove a user.
     *
     * @param user the user object to be removed
     * @param appId the id of the app executing the call
     */
    doRemove(user: IUser, appId: string): Promise<boolean>;

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
    doUpdate(user: IUser, updates: Partial<IUser>, appId: string): Promise<boolean>;
}
