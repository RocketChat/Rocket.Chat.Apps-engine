import { RocketletSlashCommandManager } from '../managers';

import { ISlashCommandsModify } from 'temporary-rocketlets-ts-definition/accessors';
import { ISlashCommand } from 'temporary-rocketlets-ts-definition/slashcommands';

export class SlashCommandsModify implements ISlashCommandsModify {
    constructor(private readonly manager: RocketletSlashCommandManager, private readonly rocketletId: string) { }

    public modifySlashCommand(slashCommand: ISlashCommand): void {
        this.manager.modifyCommand(this.rocketletId, slashCommand);
    }

    public disableSlashCommand(command: string): void {
        this.manager.disableCommand(command, this.rocketletId);
    }
}
