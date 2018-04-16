import { AppSlashCommandManager } from '../managers/AppSlashCommandManager';

import { ISlashCommandsExtend } from '@rocket.chat/apps-ts-definition/accessors';
import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';

export class SlashCommandsExtend implements ISlashCommandsExtend {
    constructor(private readonly manager: AppSlashCommandManager, private readonly appId: string) { }

    public provideSlashCommand(slashCommand: ISlashCommand): Promise<void> {
        return Promise.resolve(this.manager.addCommand(this.appId, slashCommand));
    }
}
