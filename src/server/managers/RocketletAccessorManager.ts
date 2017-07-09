import { ConfigurationExtend, SettingsExtend, SlashCommandsExtend } from '../accessors';
import { RocketletManager } from '../RocketletManager';
import { IRocketletStorageItem } from '../storage';

import { IConfigurationExtend } from 'temporary-rocketlets-ts-definition/accessors';

export class RocketletAccessorManager {
    private configExtenders: Map<string, IConfigurationExtend>;

    constructor(private readonly manager: RocketletManager) {
        this.configExtenders = new Map<string, IConfigurationExtend>();
    }

    public getConfigurationExtend(storageItem: IRocketletStorageItem): IConfigurationExtend {
        if (!this.configExtenders.has(storageItem.id)) {
            const cmds = new SlashCommandsExtend(this.manager.getCommandManager(), storageItem.id);
            const sets = new SettingsExtend(storageItem);
            const ext = new ConfigurationExtend(sets, cmds);

            this.configExtenders.set(storageItem.id, ext);
        }

        return this.configExtenders.get(storageItem.id);
    }
}
