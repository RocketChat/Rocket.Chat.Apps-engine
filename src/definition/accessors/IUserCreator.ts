import { ProxiedApp } from '../../server/ProxiedApp';

export interface IUserCreator {
    /**
     * Creates a user for the given app. This method will be called
     * before adding this app into the system. If failed to create
     * the app user, the app will *not* be added to the system either.
     *
     * @param app the app
     */
    createAppUser(app: ProxiedApp): Promise<string | boolean>;
}
