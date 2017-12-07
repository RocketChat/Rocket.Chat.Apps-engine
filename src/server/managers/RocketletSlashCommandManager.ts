import { ISlashCommand, SlashCommandContext } from 'temporary-rocketlets-ts-definition/slashcommands';

import { IRocketletCommandBridge } from '../bridges/IRocketletCommandBridge';
import { CommandAlreadyExistsError } from '../errors/CommandAlreadyExistsError';
import { RocketletAccessorManager } from './RocketletAccessorManager';
import { RocketletSlashCommandRegistration } from './RocketletSlashCommandRegistration';

/**
 * The command manager for the Rocketlets.
 *
 * A Rocketlet will add commands during their `initialize` method.
 * Then once a Rocketlet's `onEnable` is called and it returns true,
 * only then will that Rocketlet's commands be enabled.
 */
export class RocketletSlashCommandManager {
    // commands by rocketlet id
    private rlCommands: Map<string, Array<RocketletSlashCommandRegistration>>;
    // loaded commands
    private commands: Map<string, RocketletSlashCommandRegistration>;
    private commandMappingToRocketlet: Map<string, string>;

    // tslint:disable-next-line:max-line-length
    constructor(private readonly bridge: IRocketletCommandBridge, private readonly accessors: RocketletAccessorManager) {
        this.rlCommands = new Map<string, Array<RocketletSlashCommandRegistration>>();
        this.commands = new Map<string, RocketletSlashCommandRegistration>();
        this.commandMappingToRocketlet = new Map<string, string>();
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
            this.rlCommands.set(rocketletId, new Array<RocketletSlashCommandRegistration>());
        }

        this.rlCommands.get(rocketletId).push(new RocketletSlashCommandRegistration(command));
    }

    /**
     * Modifies an existing command. The command must either be your Rocketlet's
     * own command or a system command. One Rocketlet can not modify another
     * Rocketlet's command.
     *
     * @param rocketletId the rocketlet's id of the command to modify
     * @param command the modified command to replace the current one with
     */
    // TODO: Rework this logic, as the logic inside the method does not match up to the documentation
    public modifyCommand(rocketletId: string, command: ISlashCommand): void {
        // tslint:disable-next-line:max-line-length
        if (!this.rlCommands.has(rocketletId) || this.rlCommands.get(rocketletId).filter((r) => r.slashCommand.command === command.command).length === 0) {
            if (!this.bridge.doesCommandExist(command.command, rocketletId)) {
                throw new Error('You must first register a command before you can modify it.');
            }
        }

        const index = this.rlCommands.get(rocketletId).findIndex((r) => r.slashCommand.command === command.command);
        if (index === -1) {
            this.bridge.modifyCommand(command, rocketletId);
        } else {
            this.rlCommands.get(rocketletId)[index].slashCommand = command;
        }

        this.commandMappingToRocketlet.set(command.command, rocketletId);
    }

    public enableCommand(rocketletId: string, command: string): void {
        const cmdInfo = this.getRocketletCommand(rocketletId, command);
        if (this.isAlreadyDefined(command) && cmdInfo && !cmdInfo.isRegistered) {
            cmdInfo.isDisabled = false;
            cmdInfo.isEnabled = true;
            return;
        }

        const exists = this.bridge.doesCommandExist(command, rocketletId);
        if (!exists && !cmdInfo) {
            throw new Error(`The command "${command}" does not exist to disable.`);
        } else if (!exists && cmdInfo) {
            // This means it was "disabled" when the command was registered
            // so now we need to register it again.
            this.registerCommand(rocketletId, cmdInfo);
            return;
        }

        this.bridge.enableCommand(command, rocketletId);
    }

    /**
     * Renders an existing slash command un-usable.
     *
     * @param rocketletId the rocketlet's id which is disabling the command
     * @param command the command to disable in the bridged system
     */
    public disableCommand(rocketletId: string, command: string): void {
        const cmdInfo = this.getRocketletCommand(rocketletId, command);
        if (this.isAlreadyDefined(command) && cmdInfo && !cmdInfo.isRegistered) {
            cmdInfo.isDisabled = true;
            cmdInfo.isEnabled = false;
            return;
        }

        if (!this.bridge.doesCommandExist(command, rocketletId)) {
            throw new Error(`The command "${command}" does not exist to disable.`);
        }

        this.bridge.disableCommand(command, rocketletId);
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

        this.rlCommands.get(rocketletId).forEach((r) => {
            r.isRegistered = true;
            if (r.isDisabled) {
                return;
            }

            this.registerCommand(rocketletId, r);
        });
    }

    public unregisterCommands(rocketletId: string): void {
        if (!this.rlCommands.has(rocketletId)) {
            return;
        }

        this.rlCommands.get(rocketletId).forEach((r) => {
            this.commands.delete(r.slashCommand.command);
            this.commandMappingToRocketlet.delete(r.slashCommand.command);
            this.bridge.unregisterCommand(r.slashCommand.command, rocketletId);
            r.isRegistered = false;
        });

        this.rlCommands.delete(rocketletId);
    }

    /**
     * Executes a Rocketlet's command.
     *
     * @param command the command to execute
     * @param context the context in which the command was entered
     */
    public executeCommand(command: string, context: SlashCommandContext): void {
        if (!this.commands.has(command) || !this.commandMappingToRocketlet.has(command)) {
            return;
        }

        const rocketletId = this.commandMappingToRocketlet.get(command);
        const reader = this.accessors.getReader(rocketletId);
        const modify = this.accessors.getModifier(rocketletId);
        const http = this.accessors.getHttp(rocketletId);

        // TODO: Maybe run it in a context/sandbox? :thinking:
        this.commands.get(command).slashCommand.executor(context, reader, modify, http);
    }

    private registerCommand(rocketletId: string, info: RocketletSlashCommandRegistration): void {
        this.commands.set(info.slashCommand.command, info);
        this.commandMappingToRocketlet.set(info.slashCommand.command, rocketletId);
        this.bridge.registerCommand(info.slashCommand, rocketletId);
    }

    /**
     * Determines whether the provided command is already defined in the Rocketlet system or not.
     *
     * @param command the command to check if it exists or not
     */
    private isAlreadyDefined(command: string): boolean {
        let exists: boolean = false;

        this.rlCommands.forEach((cmds) => cmds.forEach((r) => {
            if (r.slashCommand.command === command) {
                exists = true;
            }
        }));

        return exists;
    }

    private getRocketletCommand(rocketletId: string, command: string): RocketletSlashCommandRegistration | undefined {
        if (!this.isAlreadyDefined(command)) {
            return undefined;
        }

        let info: RocketletSlashCommandRegistration;

        this.rlCommands.get(rocketletId).forEach((r) => {
            if (r.slashCommand.command === command) {
                info = r;
            }
        });

        return info;
    }
}
