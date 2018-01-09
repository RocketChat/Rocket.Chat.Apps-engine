import { AppSlashCommandManager } from '../managers';

import { ISlashCommandsModify } from '@rocket.chat/apps-ts-definition/accessors';
import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';

export class SlashCommandsModify implements ISlashCommandsModify {
    constructor(private readonly manager: AppSlashCommandManager, private readonly appId: string) { }

    public modifySlashCommand(slashCommand: ISlashCommand): void {
        this.manager.modifyCommand(this.appId, slashCommand);
    }

    public disableSlashCommand(command: string): void {
        this.manager.disableCommand(this.appId, command);
    }

    public enableSlashCommand(command: string): void {
        this.manager.enableCommand(this.appId, command);
    }
}
