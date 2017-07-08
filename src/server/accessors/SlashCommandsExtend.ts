import { RocketletSlashCommandManager } from '../managers/RocketletSlashCommandManager';

import { ISlashCommandsExtend } from 'temporary-rocketlets-ts-definition/accessors';
import { ISlashCommand } from 'temporary-rocketlets-ts-definition/slashcommands';

export class SlashCommandsExtend implements ISlashCommandsExtend {
    constructor(private readonly manager: RocketletSlashCommandManager, private readonly rocketletId: string) {
        console.log('Slash Command Extender for:', this.rocketletId);
    }

    public provideSlashCommand(slashCommand: ISlashCommand): void {
        this.manager.addCommand(this.rocketletId, slashCommand);
    }
}
