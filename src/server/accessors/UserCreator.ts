import { IUserCreator } from '../../definition/accessors/IUserCreator';
import { AppBridges } from '../bridges';
import { ProxiedApp } from '../ProxiedApp';

export class UserCreator implements IUserCreator {
    constructor(
        private readonly bridges: AppBridges,
    ) { }

    public createAppUser(app: ProxiedApp): Promise<string | boolean> {
        const userData = {
            name: app.getInfo().name,
            username: app.getInfo().nameSlug,
            email: `${ Math.random().toString(36).slice(2, 10) }@rocketchat.app`,
            roles: ['app'],
            joinDefaultChannels: true,
            sendWelcomeEmail: false,
            setRandomPassword: true,
            appId: app.getID(),
        };

        return this.bridges.getUserBridge().create(userData, app.getID(), {
            avatarUrl: app.getInfo().iconFileContent || app.getInfo().iconFile,
        });
    }
}
