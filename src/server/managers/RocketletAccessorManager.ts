import { ConfigurationExtend } from '../accessors/ConfigurationExtend';
import { SlashCommandsExtend } from '../accessors/SlashCommandsExtend';
import { RocketletManager } from '../RocketletManager';

import { IConfigurationExtend } from 'temporary-rocketlets-ts-definition/accessors';

export class RocketletAccessorManager {
    private configExtenders: Map<string, IConfigurationExtend>;

    constructor(private readonly manager: RocketletManager) {
        this.configExtenders = new Map<string, IConfigurationExtend>();
    }

    public getConfigurationExtend(rocketletId: string): IConfigurationExtend {
        if (!this.configExtenders.has(rocketletId)) {
            const cmds = new SlashCommandsExtend(this.manager.getCommandManager(), rocketletId);
            const ext = new ConfigurationExtend(undefined, cmds);

            this.configExtenders.set(rocketletId, ext);
        }

        return this.configExtenders.get(rocketletId);
    }

}
