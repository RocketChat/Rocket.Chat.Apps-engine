import {
    ConfigurationExtend,
    EnvironmentalVariableRead,
    EnvironmentRead,
    Http,
    HttpExtend,
    LivechatRead,
    MessageRead,
    Modify,
    Notifier,
    Persistence,
    PersistenceRead,
    Reader,
    RoomRead,
    ServerSettingRead,
    SettingRead,
    SettingsExtend,
    SlashCommandsExtend,
    SlashCommandsModify,
    UploadRead,
    UserRead,
} from '../accessors';
import { ApiExtend } from '../accessors/ApiExtend';
import { ConfigurationModify } from '../accessors/ConfigurationModify';
import { ServerSettingsModify } from '../accessors/ServerSettingsModify';
import { AppManager } from '../AppManager';
import { AppBridges } from '../bridges/AppBridges';

import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    IHttpExtend,
    IModify,
    IPersistence,
    IRead,
} from '../../definition/accessors';

export class AppAccessorManager {
    private readonly bridges: AppBridges;
    private readonly configExtenders: Map<string, IConfigurationExtend>;
    private readonly envReaders: Map<string, IEnvironmentRead>;
    private readonly configModifiers: Map<string, IConfigurationModify>;
    private readonly readers: Map<string, IRead>;
    private readonly modifiers: Map<string, IModify>;
    private readonly persists: Map<string, IPersistence>;
    private readonly https: Map<string, IHttp>;

    constructor(private readonly manager: AppManager) {
        this.bridges = this.manager.getBridges();
        this.configExtenders = new Map<string, IConfigurationExtend>();
        this.envReaders = new Map<string, IEnvironmentRead>();
        this.configModifiers = new Map<string, IConfigurationModify>();
        this.readers = new Map<string, IRead>();
        this.modifiers = new Map<string, IModify>();
        this.persists = new Map<string, IPersistence>();
        this.https = new Map<string, IHttp>();
    }

    /**
     * Purifies the accessors for the provided App.
     *
     * @param appId The id of the App to purge the accessors for.
     */
    public purifyApp(appId: string): void {
        this.configExtenders.delete(appId);
        this.envReaders.delete(appId);
        this.configModifiers.delete(appId);
        this.readers.delete(appId);
        this.modifiers.delete(appId);
        this.persists.delete(appId);
        this.https.delete(appId);
    }

    public getConfigurationExtend(appId: string): IConfigurationExtend {
        if (!this.configExtenders.has(appId)) {
            const rl = this.manager.getOneById(appId);

            if (!rl) {
                throw new Error(`No App found by the provided id: ${ appId }`);
            }

            const htt = new HttpExtend();
            const cmds = new SlashCommandsExtend(this.manager.getCommandManager(), appId);
            const apis = new ApiExtend(this.manager.getApiManager(), appId);
            const sets = new SettingsExtend(rl);

            this.configExtenders.set(appId, new ConfigurationExtend(htt, sets, cmds, apis));
        }

        return this.configExtenders.get(appId);
    }

    public getEnvironmentRead(appId: string): IEnvironmentRead {
        if (!this.envReaders.has(appId)) {
            const rl = this.manager.getOneById(appId);

            if (!rl) {
                throw new Error(`No App found by the provided id: ${ appId }`);
            }

            const sets = new SettingRead(rl);
            const servsets = new ServerSettingRead(this.bridges.getServerSettingBridge(), appId);
            const env = new EnvironmentalVariableRead(this.bridges.getEnvironmentalVariableBridge(), appId);

            this.envReaders.set(appId, new EnvironmentRead(sets, servsets, env));
        }

        return this.envReaders.get(appId);
    }

    public getConfigurationModify(appId: string): IConfigurationModify {
        if (!this.configModifiers.has(appId)) {
            const sets = new ServerSettingsModify(this.bridges.getServerSettingBridge(), appId);
            const cmds = new SlashCommandsModify(this.manager.getCommandManager(), appId);

            this.configModifiers.set(appId, new ConfigurationModify(sets, cmds));
        }

        return this.configModifiers.get(appId);
    }

    public getReader(appId: string): IRead {
        if (!this.readers.has(appId)) {
            const env = this.getEnvironmentRead(appId);
            const msg = new MessageRead(this.bridges.getMessageBridge(), appId);
            const persist = new PersistenceRead(this.bridges.getPersistenceBridge(), appId);
            const room = new RoomRead(this.bridges.getRoomBridge(), appId);
            const user = new UserRead(this.bridges.getUserBridge(), appId);
            const noti = new Notifier(this.bridges.getMessageBridge(), appId);
            const livechat = new LivechatRead(this.bridges.getLivechatBridge(), appId);
            const upload = new UploadRead(this.bridges.getUploadBridge(), appId);

            this.readers.set(appId, new Reader(env, msg, persist, room, user, noti, livechat, upload));
        }

        return this.readers.get(appId);
    }

    public getModifier(appId: string): IModify {
        if (!this.modifiers.has(appId)) {
            this.modifiers.set(appId, new Modify(this.bridges, appId));
        }

        return this.modifiers.get(appId);
    }

    public getPersistence(appId: string): IPersistence {
        if (!this.persists.has(appId)) {
            this.persists.set(appId, new Persistence(this.bridges.getPersistenceBridge(), appId));
        }

        return this.persists.get(appId);
    }

    public getHttp(appId: string): IHttp {
        if (!this.https.has(appId)) {
            let ext: IHttpExtend;
            if (this.configExtenders.has(appId)) {
                ext = this.configExtenders.get(appId).http;
            } else {
                const cf = this.getConfigurationExtend(appId);
                ext = cf.http;
            }

            this.https.set(appId, new Http(this, this.bridges, ext, appId));
        }

        return this.https.get(appId);
    }
}
