import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-ts-definition/slashcommands';

import { AppManager } from '../AppManager';
import { IAppCommandBridge } from '../bridges/IAppCommandBridge';
import { CommandAlreadyExistsError } from '../errors/CommandAlreadyExistsError';
import { AppAccessorManager } from './AppAccessorManager';
import { AppSlashCommandRegistration } from './AppSlashCommandRegistration';

/**
 * The command manager for the Apps.
 *
 * An App will add commands during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's commands be enabled.
 */
export class AppSlashCommandManager {
    private readonly bridge: IAppCommandBridge;
    private readonly accessors: AppAccessorManager;
    // commands by app id
    private rlCommands: Map<string, Array<AppSlashCommandRegistration>>;
    // loaded commands
    private commands: Map<string, AppSlashCommandRegistration>;
    private commandMappingToApp: Map<string, string>;

    // tslint:disable-next-line:max-line-length
    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getCommandBridge();
        this.accessors = this.manager.getAccessorManager();
        this.rlCommands = new Map<string, Array<AppSlashCommandRegistration>>();
        this.commands = new Map<string, AppSlashCommandRegistration>();
        this.commandMappingToApp = new Map<string, string>();
    }

    /**
     * Adds a command to be registered. This will not register it with the
     * bridged system yet as this is only called on an App's
     * `initialize` method which the App might not be enabled.
     *
     * @param appId the app's id which the command belongs to
     * @param command the command to add to the system
     */
    public addCommand(appId: string, command: ISlashCommand): void {
        command.command = command.command.toLowerCase().trim();

        if (this.bridge.doesCommandExist(command.command, appId) || this.isAlreadyDefined(command.command)) {
            throw new CommandAlreadyExistsError(command.command);
        }

        if (!this.rlCommands.has(appId)) {
            this.rlCommands.set(appId, new Array<AppSlashCommandRegistration>());
        }

        this.rlCommands.get(appId).push(new AppSlashCommandRegistration(command));
    }

    /**
     * Modifies an existing command. The command must either be your App's
     * own command or a system command. One App can not modify another
     * App's command.
     *
     * @param appId the app's id of the command to modify
     * @param command the modified command to replace the current one with
     */
    // TODO: Rework this logic, as the logic inside the method does not match up to the documentation
    public modifyCommand(appId: string, command: ISlashCommand): void {
        // tslint:disable-next-line:max-line-length
        if (!this.rlCommands.has(appId) || this.rlCommands.get(appId).filter((r) => r.slashCommand.command === command.command).length === 0) {
            if (!this.bridge.doesCommandExist(command.command, appId)) {
                throw new Error('You must first register a command before you can modify it.');
            }
        }

        const index = this.rlCommands.get(appId).findIndex((r) => r.slashCommand.command === command.command);
        if (index === -1) {
            this.bridge.modifyCommand(command, appId);
        } else {
            this.rlCommands.get(appId)[index].slashCommand = command;
        }

        this.commandMappingToApp.set(command.command, appId);
    }

    public enableCommand(appId: string, command: string): void {
        const cmdInfo = this.getAppCommand(appId, command);
        if (this.isAlreadyDefined(command) && cmdInfo && !cmdInfo.isRegistered) {
            cmdInfo.isDisabled = false;
            cmdInfo.isEnabled = true;
            return;
        }

        const exists = this.bridge.doesCommandExist(command, appId);
        if (!exists && !cmdInfo) {
            throw new Error(`The command "${command}" does not exist to disable.`);
        } else if (!exists && cmdInfo) {
            // This means it was "disabled" when the command was registered
            // so now we need to register it again.
            this.registerCommand(appId, cmdInfo);
            return;
        }

        this.bridge.enableCommand(command, appId);
    }

    /**
     * Renders an existing slash command un-usable.
     *
     * @param appId the app's id which is disabling the command
     * @param command the command to disable in the bridged system
     */
    public disableCommand(appId: string, command: string): void {
        const cmdInfo = this.getAppCommand(appId, command);
        if (this.isAlreadyDefined(command) && cmdInfo && !cmdInfo.isRegistered) {
            cmdInfo.isDisabled = true;
            cmdInfo.isEnabled = false;
            return;
        }

        if (!this.bridge.doesCommandExist(command, appId)) {
            throw new Error(`The command "${command}" does not exist to disable.`);
        }

        this.bridge.disableCommand(command, appId);
    }

    /**
     * Registers all of the commands for the provided app inside
     * of the bridged system which then enables them.
     *
     * @param appId The app's id of which to register it's commands with the bridged system
     */
    public registerCommands(appId: string): void {
        if (!this.rlCommands.has(appId)) {
            return;
        }

        this.rlCommands.get(appId).forEach((r) => {
            r.isRegistered = true;
            if (r.isDisabled) {
                return;
            }

            this.registerCommand(appId, r);
        });
    }

    public unregisterCommands(appId: string): void {
        if (!this.rlCommands.has(appId)) {
            return;
        }

        this.rlCommands.get(appId).forEach((r) => {
            this.commands.delete(r.slashCommand.command);
            this.commandMappingToApp.delete(r.slashCommand.command);
            this.bridge.unregisterCommand(r.slashCommand.command, appId);
            r.isRegistered = false;
        });

        this.rlCommands.delete(appId);
    }

    /**
     * Executes an App's command.
     *
     * @param command the command to execute
     * @param context the context in which the command was entered
     */
    public executeCommand(command: string, context: SlashCommandContext): void {
        if (!this.commands.has(command) || !this.commandMappingToApp.has(command)) {
            return;
        }

        const app = this.manager.getOneById(this.commandMappingToApp.get(command));
        const slashCommand = this.commands.get(command).slashCommand;

        const runContext = app.makeContext({
            slashCommand,
            args: [
                context,
                this.accessors.getReader(app.getID()),
                this.accessors.getModifier(app.getID()),
                this.accessors.getHttp(app.getID()),
                this.accessors.getPersistence(app.getID()),
            ],
        });

        const logger = app.setupLogger(AppMethod._COMMAND_EXECUTOR);
        logger.debug(`${ command } is being executed...`, context);

        try {
            const runCode = 'slashCommand.executor.apply(slashCommand, args)';
            app.runInContext(runCode, runContext);
            logger.debug(`${ command } was successfully executed.`);
        } catch (e) {
            logger.error(e);
            logger.debug(`${ command } was unsuccessful.`);
        }

        this.manager.getLogStorage().storeEntries(app.getID(), logger);
    }

    private registerCommand(appId: string, info: AppSlashCommandRegistration): void {
        this.commands.set(info.slashCommand.command, info);
        this.commandMappingToApp.set(info.slashCommand.command, appId);
        this.bridge.registerCommand(info.slashCommand, appId);
    }

    /**
     * Determines whether the provided command is already defined in the App system or not.
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

    private getAppCommand(appId: string, command: string): AppSlashCommandRegistration | undefined {
        if (!this.isAlreadyDefined(command)) {
            return undefined;
        }

        let info: AppSlashCommandRegistration;

        this.rlCommands.get(appId).forEach((r) => {
            if (r.slashCommand.command === command) {
                info = r;
            }
        });

        return info;
    }
}
