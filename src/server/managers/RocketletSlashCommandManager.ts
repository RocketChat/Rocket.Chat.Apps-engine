import { ISlashCommand, ISlashCommandContext } from 'temporary-rocketlets-ts-definition/slashcommands';
import { IRocketletCommandBridge } from '../bridges/IRocketletCommandBridge';
import { CommandAlreadyExistsError } from '../errors/CommandAlreadyExistsError';

/**
 * The command manager for the Rocketlets.
 *
 * A Rocketlet will add commands during their `initialize` method.
 * Then once a Rocketlet's `onEnable` is called and it returns true,
 * only then will that Rocketlet's commands be enabled.
 */
export class RocketletSlashCommandManager {
    // commands by rocketlet id
    private rlCommands: Map<string, Array<ISlashCommand>>;
    private commands: Map<string, ISlashCommand>;

    constructor(private readonly bridge: IRocketletCommandBridge) {
        this.rlCommands = new Map<string, Array<ISlashCommand>>();
        this.commands = new Map<string, ISlashCommand>();
    }

    /**
     * Adds a command to be registered. This will not register it with the
     * bridged system yet as this is only called on a Rocketlet's
     * `initialize` method which the Rocketlet might not be enabled.
     *
     * @param rocketletId the rocketlet's id which the command belongs to
     * @param command the command to add to the system
     */
    public addCommand(rocketletId: string, command: ISlashCommand): void {
        command.command = command.command.toLowerCase().trim();

        if (this.bridge.doesCommandExist(command.command, rocketletId) || this.isAlreadyDefined(command.command)) {
            throw new CommandAlreadyExistsError(command.command);
        }

        if (!this.rlCommands.has(rocketletId)) {
            this.rlCommands.set(rocketletId, new Array<ISlashCommand>());
        }

        this.rlCommands.get(rocketletId).push(command);
    }

    /**
     * Modifies an existing command.
     * Note: The command must have been previously registered to be able to modify it.
     *
     * @param rocketletId the rocketlet's id of the command to modify
     * @param command the modified command to replace the current one with
     */
    public modifyCommand(rocketletId: string, command: ISlashCommand): void {
        // tslint:disable-next-line:max-line-length
        if (!this.rlCommands.has(rocketletId) || this.rlCommands.get(rocketletId).filter((c) => c.command === command.command).length === 0) {
            throw new Error('You must first register a command before you can modify it.');
        }

        const index = this.rlCommands.get(rocketletId).findIndex((c) => c.command === command.command);
        this.rlCommands.get(rocketletId)[index] = command;
    }

    /**
     * Renders an existing slash command un-usable.
     *
     * @param rocketletId the rocketlet's id which is disabling the command
     * @param command the command to disable in the bridged system
     */
    public disableCommand(rocketletId: string, command: string): void {
        if (!this.bridge.doesCommandExist(command, rocketletId)) {
            throw new Error(`The command "${command}" does not exist to disable.`);
        }

        this.bridge.disableCommand(rocketletId, command);
    }

    /**
     * Registers all of the commands for the provided rocketlet inside
     * of the bridged system which then enables them.
     *
     * @param rocketletId The rocketlet's id of which to register it's commands with the bridged system
     */
    public registerCommands(rocketletId: string): void {
        if (!this.rlCommands.has(rocketletId)) {
            return;
        }

        this.rlCommands.get(rocketletId).forEach((cmd) => {
            this.commands.set(cmd.command, cmd);
            this.bridge.registerCommand(cmd.command, rocketletId, this.commandExecutor.bind(this));
        });
    }

    public unregisterCommands(rocketletId: string): void {
        if (!this.rlCommands.has(rocketletId)) {
            return;
        }

        this.rlCommands.get(rocketletId).forEach((cmd) => {
            this.commands.delete(cmd.command);
            this.bridge.unregisterCommand(cmd.command, rocketletId);
        });
    }

    /**
     * Determines whether the provided command is already defined internally or not.
     *
     * @param command the command to check if it exists or not
     */
    private isAlreadyDefined(command: string): boolean {
        let exists: boolean = false;

        this.rlCommands.forEach((cmds) => cmds.forEach((c) => {
            if (c.command === command) {
                exists = true;
            }
        }));

        return exists;
    }

    /**
     * Executes a Rocketlet's command.
     *
     * @param command the command to execute
     * @param context the context in which the command was entered
     */
    private commandExecutor(command: string, context: ISlashCommandContext): void {
        if (!this.commands.has(command)) {
            return;
        }

        // TODO: UMMM YEAH THIS! context it
        this.commands.get(command).executor(context, undefined, undefined, undefined);
    }
}
