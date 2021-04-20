import { IHttp, IModify, IPersistence, IRead } from '../../../src/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '../../../src/definition/slashcommands';

import { IAppCommandBridge } from '../../../src/server/bridges';
import { TestData } from '../utilities';

export class TestsCommandBridge implements IAppCommandBridge {
    // tslint:disable-next-line:max-line-length
    public commands: Map<string, (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => void>;

    constructor() {
        // tslint:disable-next-line:max-line-length
        this.commands = new Map<string, (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => void>();
        this.commands.set('it-exists', TestData.getSlashCommand('it-exists').executor);
    }

    public doDoesCommandExist(command: string, appId: string): boolean {
        return this.commands.has(command);
    }

    public doEnableCommand(command: string, appId: string): void {
        return;
    }

    public doDisableCommand(command: string, appId: string): void {
        return;
    }

    public doModifyCommand(command: ISlashCommand, appId: string): void {
        return;
    }

    public doRestoreCommand(comand: string, appId: string): void {
        return;
    }

    public doRegisterCommand(command: ISlashCommand, appId: string): void {
        if (this.commands.has(command.command)) {
            throw new Error(`Command "${command.command}" has already been registered.`);
        }

        this.commands.set(command.command, command.executor);
    }

    public doUnregisterCommand(command: string, appId: string): void {
        this.commands.delete(command);
    }
}
