import {
    ConfigurationExtend,
    EnvironmentalVariableRead,
    EnvironmentRead,
    Http,
    HttpExtend,
    MessageRead,
    Modify,
    Persistence,
    PersistenceRead,
    Reader,
    RoomRead,
    ServerSettingRead,
    SettingRead,
    SettingsExtend,
    SlashCommandsExtend,
    SlashCommandsModify,
    UserRead,
} from '../accessors';
import { ConfigurationModify } from '../accessors/ConfigurationModify';
import { ServerSettingsModify } from '../accessors/ServerSettingsModify';
import { RocketletBridges } from '../bridges/RocketletBridges';
import { RocketletManager } from '../RocketletManager';

import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from 'temporary-rocketlets-ts-definition/accessors';

export class RocketletAccessorManager {
    private readonly bridges: RocketletBridges;
    private readonly configExtenders: Map<string, IConfigurationExtend>;
    private readonly envReaders: Map<string, IEnvironmentRead>;
    private readonly configModifiers: Map<string, IConfigurationModify>;
    private readonly readers: Map<string, IRead>;
    private readonly modifiers: Map<string, IModify>;
    private readonly persists: Map<string, IPersistence>;
    private readonly https: Map<string, IHttp>;

    constructor(private readonly manager: RocketletManager) {
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
     * Purifies the accessors for the provided Rocketlet.
     *
     * @param rocketletId The id of the Rocketlet to purge the accessors for.
     */
    public purifyRocketlet(rocketletId: string): void {
        this.configExtenders.delete(rocketletId);
        this.envReaders.delete(rocketletId);
        this.configModifiers.delete(rocketletId);
        this.readers.delete(rocketletId);
        this.modifiers.delete(rocketletId);
        this.persists.delete(rocketletId);
        this.https.delete(rocketletId);
    }

    public getConfigurationExtend(rocketletId: string): IConfigurationExtend {
        if (!this.configExtenders.has(rocketletId)) {
            const rl = this.manager.getOneById(rocketletId);

            if (!rl) {
                throw new Error(`No Rocketlet found by the provided id: ${ rocketletId }`);
            }

            const htt = new HttpExtend();
            const cmds = new SlashCommandsExtend(this.manager.getCommandManager(), rocketletId);
            const sets = new SettingsExtend(rl);

            this.configExtenders.set(rocketletId, new ConfigurationExtend(htt, sets, cmds));
        }

        return this.configExtenders.get(rocketletId);
    }

    public getEnvironmentRead(rocketletId: string): IEnvironmentRead {
        if (!this.envReaders.has(rocketletId)) {
            const rl = this.manager.getOneById(rocketletId);

            if (!rl) {
                throw new Error(`No Rocketlet found by the provided id: ${ rocketletId }`);
            }

            const sets = new SettingRead(rl);
            const servsets = new ServerSettingRead(this.bridges.getServerSettingBridge(), rocketletId);
            const env = new EnvironmentalVariableRead(this.bridges.getEnvironmentalVariableBridge(), rocketletId);

            this.envReaders.set(rocketletId, new EnvironmentRead(sets, servsets, env));
        }

        return this.envReaders.get(rocketletId);
    }

    public getConfigurationModify(rocketletId: string): IConfigurationModify {
        if (!this.configModifiers.has(rocketletId)) {
            const sets = new ServerSettingsModify(this.bridges.getServerSettingBridge(), rocketletId);
            const cmds = new SlashCommandsModify(this.manager.getCommandManager(), rocketletId);

            this.configModifiers.set(rocketletId, new ConfigurationModify(sets, cmds));
        }

        return this.configModifiers.get(rocketletId);
    }

    public getReader(rocketletId: string): IRead {
        if (!this.readers.has(rocketletId)) {
            const env = this.getEnvironmentRead(rocketletId);
            const msg = new MessageRead(this.bridges.getMessageBridge(), rocketletId);
            const persist = new PersistenceRead(this.bridges.getPersistenceBridge(), rocketletId);
            const room = new RoomRead(this.bridges.getRoomBridge(), rocketletId);
            const user = new UserRead(this.bridges.getUserBridge(), rocketletId);

            this.readers.set(rocketletId, new Reader(env, msg, persist, room, user));
        }

        return this.readers.get(rocketletId);
    }

    public getModifier(rocketletId: string): IModify {
        if (!this.modifiers.has(rocketletId)) {
            this.modifiers.set(rocketletId, new Modify(this.bridges, rocketletId));
        }

        return this.modifiers.get(rocketletId);
    }

    public getPersistence(rocketletId: string): IPersistence {
        if (!this.persists.has(rocketletId)) {
            this.persists.set(rocketletId, new Persistence(this.bridges.getPersistenceBridge(), rocketletId));
        }

        return this.persists.get(rocketletId);
    }

    public getHttp(rocketletId: string): IHttp {
        if (!this.https.has(rocketletId)) {
            const ext = this.configExtenders.get(rocketletId).http;
            this.https.set(rocketletId, new Http(this, this.bridges, ext, rocketletId));
        }

        return this.https.get(rocketletId);
    }
}
