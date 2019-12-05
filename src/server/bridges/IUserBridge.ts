import { IUser, IUserCreation, UserType } from '../../definition/users';

export interface IUserBridge {
    getById(id: string, appId: string): Promise<IUser>;

    getByUsername(username: string, appId: string): Promise<IUser>;

    /**
     * Creates a user.
     * @param data the essential data for creating a user
     * @param appId the id of the app calling this
     * @param type (optional) specifying the type of the user, UserType.USER by default.
     */
    create(data: IUserCreation, appId: string, type?: UserType): Promise<string>;

    getActiveUserCount(): Promise<number>;
}
