import { IUserCreator } from '../../definition/accessors/IUserCreator';
import { AppManager } from '../AppManager';
import { AppBridges } from '../bridges';

export class UserCreator implements IUserCreator {
    constructor(
        private readonly bridges: AppBridges,
        private readonly appId: string,
    ) { }

    public createAppUser(): Promise<string> {
        const app = AppManager.Instance.getOneById(this.appId);

        if (!app) {
            throw new Error(`App ${ this.appId } was not found!`);
        }

        const userData = {
            name: app.getInfo().name,
            username: app.getInfo().nameSlug,
            email: `${ Math.random().toString(36).slice(2, 10) }@rocketchat.app`,
            roles: ['app'],
            joinDefaultChannels: true,
            sendWelcomeEmail: false,
            setRandomPassword: true,
        };

        return this.bridges.getUserBridge().create(userData, this.appId, {
            avatarUrl: app.getInfo().iconFileContent || app.getInfo().iconFile,
        });
    }
}
