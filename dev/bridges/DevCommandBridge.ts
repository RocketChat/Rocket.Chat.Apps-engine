import { IBuilder, IHttp, IRead } from 'temporary-rocketlets-ts-definition/accessors';
import { ISlashCommand, SlashCommandContext } from 'temporary-rocketlets-ts-definition/slashcommands';

import { IRocketletCommandBridge } from '../../src/server/bridges';

export class DevCommandBridge implements IRocketletCommandBridge {
    private commands: Map<string, (context: SlashCommandContext, builder: IBuilder, read: IRead, http: IHttp) => void>;

    constructor() {
        // tslint:disable-next-line:max-line-length
        this.commands = new Map<string, (context: SlashCommandContext, builder: IBuilder, read: IRead, http: IHttp) => void>();
    }

    public doesCommandExist(command: string, rocketletId: string): boolean {
        return this.commands.has(command);
    }

    public disableCommand(command: string, rocketletId: string): void {
        console.log(`Disabling the command "${command}" per request of the rocketlet: ${rocketletId}`);
    }

    public modifyCommand(command: ISlashCommand, rocketletId: string): void {
        throw new Error('Not implemented.');
    }

    public registerCommand(command: ISlashCommand, rocketletId: string): void {
        if (this.commands.has(command.command)) {
            throw new Error(`Command "${command.command}" has already been registered.`);
        }

        this.commands.set(command.command, command.executor);
        console.log(`Registered the command "${command.command}".`);
    }

    public unregisterCommand(command: string, rocketletId: string): void {
        const removed = this.commands.delete(command);

        if (removed) {
            console.log(`Unregistered the command "${command}".`);
        }
    }
}
