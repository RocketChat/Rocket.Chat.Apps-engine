import { AppSlashCommandManager } from '../managers';
import { ISlashCommandsModify } from '../../definition/accessors';
import { ISlashCommand } from '../../definition/slashcommands';
export declare class SlashCommandsModify implements ISlashCommandsModify {
    private readonly manager;
    private readonly appId;
    constructor(manager: AppSlashCommandManager, appId: string);
    modifySlashCommand(slashCommand: ISlashCommand): Promise<void>;
    disableSlashCommand(command: string): Promise<void>;
    enableSlashCommand(command: string): Promise<void>;
}
