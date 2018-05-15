import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-ts-definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-ts-definition/slashcommands';

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

    public doesCommandExist(command: string, appId: string): boolean {
        return this.commands.has(command);
    }

    public enableCommand(command: string, appId: string): void {
        return;
    }

    public disableCommand(command: string, appId: string): void {
        return;
    }

    public modifyCommand(command: ISlashCommand, appId: string): void {
        return;
    }

    public restoreCommand(comand: string, appId: string): void {
        return;
    }

    public registerCommand(command: ISlashCommand, appId: string): void {
        if (this.commands.has(command.command)) {
            throw new Error(`Command "${command.command}" has already been registered.`);
        }

        this.commands.set(command.command, command.executor);
    }

    public unregisterCommand(command: string, appId: string): void {
        this.commands.delete(command);
    }
}
