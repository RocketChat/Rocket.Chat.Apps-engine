import { ISlashCommand, ISlashCommandContext } from 'temporary-rocketlets-ts-definition/slashcommands';

import { IRocketletCommandBridge } from '../../src/server/bridges';

export class DevCommandBridge implements IRocketletCommandBridge {
    private commands: Map<string, (command: string, context: ISlashCommandContext) => {}>;

    constructor() {
        this.commands = new Map<string, (command: string, context: ISlashCommandContext) => {}>();
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

    // tslint:disable-next-line:max-line-length
    public registerCommand(command: string, rocketletId: string, executor: (command: string, context: ISlashCommandContext) => {}): void {
        if (this.commands.has(command)) {
            throw new Error(`Command "${command}" has already been registered.`);
        }

        this.commands.set(command, executor);
        console.log(`Registered the command "${command}".`);
    }

    public unregisterCommand(command: string, rocketletId: string): void {
        if (!this.commands.has(command)) {
            throw new Error(`The command "${command}" was not registered.`);
        }

        this.commands.delete(command);
        console.log(`Unregistered the command "${command}".`);
    }

    public unregisterCommands(rocketletId: string): number {
        return 0;
    }
}
