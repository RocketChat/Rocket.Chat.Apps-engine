import { IUser, IUserCreationOptions, UserStatusConnection } from '../../definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;

    getByUsername(username: string, appId: string): Promise<IUser>;

    /**
     * Creates a user.
     * @param data the essential data for creating a user
     * @param appId the id of the app calling this
     * @param options options for passing extra data
     */
    create(data: Partial<IUser>, appId: string, options?: IUserCreationOptions): Promise<string>;

    /**
     * Remove the app user from the system.
     *
     * @param appId the id of the app calling this
     */
    removeAppUser(appId: string): Promise<boolean>;

    getActiveUserCount(): Promise<number>;

    /**
     * Set the status of the user.
     * @param status the status of the user
     * @param appId the id of the app calling this
     */
    setUserStatus(status: UserStatusConnection, appId: string): Promise<void>;
}
