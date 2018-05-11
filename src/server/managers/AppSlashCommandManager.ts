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
    private rlCommands: Map<string, Map<string, AppSlashCommandRegistration>>;
    // registered commands
    private registeredCommands: Map<string, AppSlashCommandRegistration>;
    // Contains the commands which have modified the system commands
    private modifiedCommands: Map<string, AppSlashCommandRegistration>;
    // Key is the command, value is the appId which touches the command
    private commandMappingToApp: Map<string, string>;

    // tslint:disable-next-line:max-line-length
    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getCommandBridge();
        this.accessors = this.manager.getAccessorManager();
        this.rlCommands = new Map<string, Map<string, AppSlashCommandRegistration>>();
        this.registeredCommands = new Map<string, AppSlashCommandRegistration>();
        this.modifiedCommands = new Map<string, AppSlashCommandRegistration>();
        this.commandMappingToApp = new Map<string, string>();
    }

    /**
     * Adds a command to *be* registered. This will *not register* it with the
     * bridged system yet as this is only called on an App's
     * `initialize` method which the App might not be enabled.
     * When adding a command, it can *not* already exist in the system
     * (to overwrite) and another App can *not* have already provided it. Apps
     * are on a first come first serve basis for providing and modifying commands.
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
            this.rlCommands.set(appId, new Map<string, AppSlashCommandRegistration>());
        }

        this.rlCommands.get(appId).set(command.command, new AppSlashCommandRegistration(command));
    }

    /**
     * Modifies an existing command. The command must either be the App's
     * own command or a system command. One App can not modify another
     * App's command. Apps are on a first come first serve basis as to whether
     * or not they can touch or provide a command. If App "A" first provides,
     * or overwrites, a command then App "B" can not touch that command.
     *
     * @param appId the app's id of the command to modify
     * @param command the modified command to replace the current one with
     */
    // TODO: Ensure the bridge implementation of "doesCommandExist" inside Rocket.Chat only checks system commands
    public modifyCommand(appId: string, command: ISlashCommand): void {
        command.command = command.command.toLowerCase().trim();
        const isDefinedLocally = this.isAlreadyDefined(command.command);
        const doesItTouchCmd = this.doesAppTouchThisCommand(appId, command.command);

        if (isDefinedLocally && !doesItTouchCmd) {
            throw new Error('You can not modify a command registered (or modified) by another App.');
        } else if (!doesItTouchCmd && !this.bridge.doesCommandExist(command.command, appId)) {
            throw new Error('You must first register a command before you can modify it.');
        }

        if (this.rlCommands.has(appId) && this.rlCommands.get(appId).has(command.command)) {
            this.rlCommands.get(appId).get(command.command).slashCommand = command;
        } else {
            this.bridge.modifyCommand(command, appId);
            this.modifiedCommands.set(command.command, new AppSlashCommandRegistration(command));
        }

        this.commandMappingToApp.set(command.command, appId);
    }

    // TODO: Evaluate what needs to happens when App "A" disables a command but App "B" wants to ensure it is enabled
    public enableCommand(appId: string, command: string): void {
        const isDefined = this.isAlreadyDefined(command);
        const cmdInfo = this.getAppCommand(appId, command);
        if (isDefined && !cmdInfo) {
            throw new Error('You can not enable a command you did not provide.');
        } else if (isDefined && cmdInfo && !cmdInfo.isRegistered) {
            cmdInfo.isDisabled = false;
            cmdInfo.isEnabled = true;
            return;
        }

        const exists = this.bridge.doesCommandExist(command, appId);
        if (!exists && !cmdInfo) {
            throw new Error(`The command "${command}" does not exist to enable.`);
        } else if (!exists && cmdInfo) {
            // This means it was "disabled" when the command was registered
            // so now we need to register it again.
            return this.registerCommand(appId, cmdInfo);
        }

        this.bridge.enableCommand(command, appId);
    }

    /**
     * Renders an existing slash command un-usable. Whether that command is provided
     * by the application calling this or a system command, we don't care. However,
     * an application can not disable another application's command.
     *
     * @param appId the app's id which is disabling the command
     * @param command the command to disable in the bridged system
     */
    // TODO: Evaluate what happens when App "A" modifies a system command but App "B" wants to disable that
    public disableCommand(appId: string, command: string): void {
        const isDefined = this.isAlreadyDefined(command);
        const cmdInfo = this.getAppCommand(appId, command);
        if (isDefined && !cmdInfo) {
            throw new Error('You can not disable a command you did not provide.');
        } else if (isDefined && cmdInfo && !cmdInfo.isRegistered) {
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
            if (r.isDisabled) {
                return;
            }

            this.registerCommand(appId, r);
        });
    }

    /**
     * Unregisters the commands from the system and restores the commands
     * which the app modified in the system.
     *
     * @param appId the appId for the commands to purge
     */
    public unregisterCommands(appId: string): void {
        if (this.rlCommands.has(appId)) {
            this.rlCommands.get(appId).forEach((r) => {
                this.registeredCommands.delete(r.slashCommand.command);
                this.commandMappingToApp.delete(r.slashCommand.command);
                this.bridge.unregisterCommand(r.slashCommand.command, appId);
                r.isRegistered = false;
            });

            this.rlCommands.delete(appId);
        }

        // The only left over ones for this appId would be modified commands
        const cmdsToRemove = new Array<string>();
        this.commandMappingToApp.forEach((aId: string, cmd: string) => {
            if (aId === appId && this.modifiedCommands.has(cmd)) {
                this.bridge.restoreCommand(cmd, appId);
                this.modifiedCommands.delete(cmd);
                cmdsToRemove.push(cmd);
            }
        });
        cmdsToRemove.forEach((cmd: string) => this.commandMappingToApp.delete(cmd));
    }

    /**
     * Executes an App's command.
     *
     * @param command the command to execute
     * @param context the context in which the command was entered
     */
    public async executeCommand(command: string, context: SlashCommandContext): Promise<void> {
        if ((!this.registeredCommands.has(command) && !this.modifiedCommands.has(command)) || !this.commandMappingToApp.has(command)) {
            return;
        }

        const app = this.manager.getOneById(this.commandMappingToApp.get(command));
        let slashCommand;

        if (this.registeredCommands.has(command)) {
            slashCommand = this.registeredCommands.get(command).slashCommand;
        } else {
            slashCommand = this.modifiedCommands.get(command).slashCommand;
        }

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
            await app.runInContext(runCode, runContext);
            logger.debug(`${ command } was successfully executed.`);
        } catch (e) {
            logger.error(e);
            logger.debug(`${ command } was unsuccessful.`);
        }

        try {
            await this.manager.getLogStorage().storeEntries(app.getID(), logger);
        } catch (e) {
            // Don't care, at the moment.
            // TODO: Evaluate to determine if we do care
        }
    }

    /**
     * Actually goes and provide's the bridged system with the command information.
     *
     * @param appId the app which is providing the command
     * @param info the command's registration information
     */
    private registerCommand(appId: string, info: AppSlashCommandRegistration): void {
        this.registeredCommands.set(info.slashCommand.command, info);
        this.commandMappingToApp.set(info.slashCommand.command, appId);
        this.bridge.registerCommand(info.slashCommand, appId);
        info.isRegistered = true;
    }

    /**
     * Determines whether the command is already provided by an App or not.
     *
     * @param command the command to check if it exists or not
     * @returns whether or not it is already provided
     */
    private isAlreadyDefined(command: string): boolean {
        let exists: boolean = false;

        this.rlCommands.forEach((cmds) => {
            if (cmds.has(command)) {
                exists = true;
            }
        });

        return exists;
    }

    /**
     * Gets a command's registration info for the commands provided (not modified) by the App.
     *
     * @param appId the app's id
     * @param command the command to get provided by the app
     * @returns the command's registration information, if it is provided by the app
     */
    private getAppCommand(appId: string, command: string): AppSlashCommandRegistration | undefined {
        return this.rlCommands.has(appId) ? this.rlCommands.get(appId).get(command) : undefined;
    }

    /**
     * Determines whether an App touches the command or not (created or modified).
     *
     * @param appId the app to check for
     * @param command the command to check against
     */
    private doesAppTouchThisCommand(appId: string, command: string): boolean {
        command = command.toLowerCase().trim();

        return (this.commandMappingToApp.has(command) && this.commandMappingToApp.get(command) === appId)
            || this.getAppCommand(appId, command) !== undefined;
    }
}
