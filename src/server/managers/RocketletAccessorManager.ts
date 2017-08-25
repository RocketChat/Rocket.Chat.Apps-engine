import {
    ConfigurationExtend,
    EnvironmentalVariableRead,
    EnvironmentRead,
    Reader,
    ServerSettingRead,
    SettingRead,
    SettingsExtend,
    SlashCommandsExtend,
    SlashCommandsModify,
    MessageRead,
} from '../accessors';
import { ConfigurationModify } from '../accessors/ConfigurationModify';
import { ServerSettingsModify } from '../accessors/ServerSettingsModify';
import { RocketletBridges } from '../bridges/RocketletBridges';
import { RocketletManager } from '../RocketletManager';
import { IRocketletStorageItem } from '../storage';

import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IRead,
} from 'temporary-rocketlets-ts-definition/accessors';

export class RocketletAccessorManager {
    private readonly bridges: RocketletBridges;
    private readonly configExtenders: Map<string, IConfigurationExtend>;
    private readonly envReaders: Map<string, IEnvironmentRead>;
    private readonly configModifiers: Map<string, IConfigurationModify>;
    private readonly readers: Map<string, IRead>;

    constructor(private readonly manager: RocketletManager) {
        this.bridges = this.manager.getBridgeManager();
        this.configExtenders = new Map<string, IConfigurationExtend>();
        this.envReaders = new Map<string, IEnvironmentRead>();
        this.configModifiers = new Map<string, IConfigurationModify>();
        this.readers = new Map<string, IRead>();
    }

    public getConfigurationExtend(storageItem: IRocketletStorageItem): IConfigurationExtend {
        if (!this.configExtenders.has(storageItem.id)) {
            const cmds = new SlashCommandsExtend(this.manager.getCommandManager(), storageItem.id);
            const sets = new SettingsExtend(storageItem);

            this.configExtenders.set(storageItem.id, new ConfigurationExtend(sets, cmds));
        }

        return this.configExtenders.get(storageItem.id);
    }

    public getEnvironmentRead(storageItem: IRocketletStorageItem): IEnvironmentRead {
        if (!this.envReaders.has(storageItem.id)) {
            const sets = new SettingRead(storageItem);
            const servsets = new ServerSettingRead(this.bridges.getServerSettingBridge(), storageItem.id);
            const env = new EnvironmentalVariableRead(this.bridges.getEnvironmentalVariableBridge(), storageItem.id);

            this.envReaders.set(storageItem.id, new EnvironmentRead(sets, servsets, env));
        }

        return this.envReaders.get(storageItem.id);
    }

    public getConfigurationModify(storageItem: IRocketletStorageItem): IConfigurationModify {
        if (!this.configModifiers.has(storageItem.id)) {
            const sets = new ServerSettingsModify(this.bridges.getServerSettingBridge(), storageItem.id);
            const cmds = new SlashCommandsModify(this.manager.getCommandManager(), storageItem.id);

            this.configModifiers.set(storageItem.id, new ConfigurationModify(sets, cmds));
        }

        return this.configModifiers.get(storageItem.id);
    }

    public getReader(storageItem: IRocketletStorageItem): IRead {
        if (!this.readers.has(storageItem.id)) {
            // Create new one
            const env = this.getEnvironmentRead(storageItem);
            const msg = new MessageRead(this.bridges.getMessageBridge(), storageItem.id);

            this.readers.set(storageItem.id, new Reader(env, msg));
        }

        return this.readers.get(storageItem.id);
    }
}
