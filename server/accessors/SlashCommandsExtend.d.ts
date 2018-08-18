import { AppSlashCommandManager } from '../managers/AppSlashCommandManager';
import { ISlashCommandsExtend } from '../../definition/accessors';
import { ISlashCommand } from '../../definition/slashcommands';
export declare class SlashCommandsExtend implements ISlashCommandsExtend {
    private readonly manager;
    private readonly appId;
    constructor(manager: AppSlashCommandManager, appId: string);
    provideSlashCommand(slashCommand: ISlashCommand): Promise<void>;
}
