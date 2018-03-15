import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-ts-definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-ts-definition/slashcommands';

import { IAppCommandBridge } from '../../src/server/bridges';

export class DevCommandBridge implements IAppCommandBridge {
    // tslint:disable-next-line:max-line-length
    private commands: Map<string, (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => void>;

    constructor() {
        // tslint:disable-next-line:max-line-length
        this.commands = new Map<string, (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence) => void>();
    }

    public doesCommandExist(command: string, appId: string): boolean {
        return this.commands.has(command);
    }

    public enableCommand(command: string, appId: string): void {
        console.log(`Enabling the command "${command}" per request of the app: ${appId}`);
    }

    public disableCommand(command: string, appId: string): void {
        console.log(`Disabling the command "${command}" per request of the app: ${appId}`);
    }

    public modifyCommand(command: ISlashCommand, appId: string): void {
        throw new Error('Not implemented.');
    }

    public registerCommand(command: ISlashCommand, appId: string): void {
        if (this.commands.has(command.command)) {
            throw new Error(`Command "${command.command}" has already been registered.`);
        }

        this.commands.set(command.command, command.executor);
        console.log(`Registered the command "${command.command}".`);
    }

    public unregisterCommand(command: string, appId: string): void {
        const removed = this.commands.delete(command);

        if (removed) {
            console.log(`Unregistered the command "${command}".`);
        }
    }
}
