import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-ts-definition/slashcommands';

import { AppManager } from '../AppManager';
import { IAppCommandBridge } from '../bridges';
import { CommandAlreadyExistsError, CommandHasAlreadyBeenTouchedError } from '../errors';
import { AppAccessorManager } from './AppAccessorManager';
import { AppSlashCommandRegistration } from './AppSlashCommandRegistration';

/**
 * The command manager for the Apps.
 *
 * An App will add commands during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's commands be enabled.
 *
 * Registered means the command has been provided to the bridged system.
 */
export class AppSlashCommandManager {
    private readonly bridge: IAppCommandBridge;
    private readonly accessors: AppAccessorManager;
    // Variable that contains the commands which have been provided by apps.
    // The key of the top map is app id and the key of the inner map is the command
    private providedCommands: Map<string, Map<string, AppSlashCommandRegistration>>;
    // Contains the commands which have modified the system commands
    private modifiedCommands: Map<string, AppSlashCommandRegistration>;
    // Contains the commands as keys and appId that touched it.
    // Doesn't matter whether the app provided, modified, disabled, or enabled.
    // As long as an app touched the command (besides to see if it exists), then it is listed here.
    private touchedCommandsToApps: Map<string, string>;
    // Contains the apps and the commands they have touched. The key is the appId and value is the commands.
    // Doesn't matter whether the app provided, modified, disabled, or enabled.
    // As long as an app touched the command (besides to see if it exists), then it is listed here.
    private appsTouchedCommands: Map<string, Array<string>>;

    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getCommandBridge();
        this.accessors = this.manager.getAccessorManager();
        this.touchedCommandsToApps = new Map<string, string>();
        this.appsTouchedCommands = new Map<string, Array<string>>();
        this.providedCommands = new Map<string, Map<string, AppSlashCommandRegistration>>();
        this.modifiedCommands = new Map<string, AppSlashCommandRegistration>();
    }

    /**
     * Checks whether an App can touch a command or not. There are only two ways an App can touch
     * a command:
     * 1. The command has yet to be touched
     * 2. The app has already touched the command
     *
     * When do we consider an App touching a command? Whenever it adds, modifies,
     * or removes one that it didn't provide.
     *
     * @param appId the app's id which to check for
     * @param command the command to check about
     * @returns whether or not the app can touch the command
     */
    public canCommandBeTouchedBy(appId: string, command: string): boolean {
        const cmd = command.toLowerCase().trim();
        return cmd && (!this.touchedCommandsToApps.has(cmd) || this.touchedCommandsToApps.get(cmd) === appId);
    }

    /**
     * Determines whether the command is already provided by an App or not.
     * It is case insensitive.
     *
     * @param command the command to check if it exists or not
     * @returns whether or not it is already provided
     */
    public isAlreadyDefined(command: string): boolean {
        const search = command.toLowerCase().trim();
        let exists: boolean = false;

        this.providedCommands.forEach((cmds) => {
            if (cmds.has(search)) {
                exists = true;
            }
        });

        return exists;
    }

    /**
     * Adds a command to *be* registered. This will *not register* it with the
     * bridged system yet as this is only called on an App's
     * `initialize` method and an App might not get enabled.
     * When adding a command, it can *not* already exist in the system
     * (to overwrite) and another App can *not* have already touched or provided it.
     * Apps are on a first come first serve basis for providing and modifying commands.
     *
     * @param appId the app's id which the command belongs to
     * @param command the command to add to the system
     */
    public addCommand(appId: string, command: ISlashCommand): void {
        command.command = command.command.toLowerCase().trim();

        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, command.command)) {
            throw new CommandHasAlreadyBeenTouchedError(command.command);
        }

        // Verify the command doesn't exist already
        if (this.bridge.doesCommandExist(command.command, appId) || this.isAlreadyDefined(command.command)) {
            throw new CommandAlreadyExistsError(command.command);
        }

        if (!this.providedCommands.has(appId)) {
            this.providedCommands.set(appId, new Map<string, AppSlashCommandRegistration>());
        }

        this.providedCommands.get(appId).set(command.command, new AppSlashCommandRegistration(command));

        // The app has now touched the command, so let's set it
        this.setAsTouched(appId, command.command);
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
    public modifyCommand(appId: string, command: ISlashCommand): void {
        command.command = command.command.toLowerCase().trim();

        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, command.command)) {
            throw new CommandHasAlreadyBeenTouchedError(command.command);
        }

        const hasNotProvidedIt = !this.providedCommands.has(appId) || !this.providedCommands.get(appId).has(command.command);

        // They haven't provided (added) it and the bridged system doesn't have it, error out
        if (hasNotProvidedIt && !this.bridge.doesCommandExist(command.command, appId)) {
            throw new Error('You must first register a command before you can modify it.');
        }

        if (hasNotProvidedIt) {
            this.bridge.modifyCommand(command, appId);
            const regInfo = new AppSlashCommandRegistration(command);
            regInfo.isDisabled = false;
            regInfo.isEnabled = true;
            regInfo.isRegistered = true;
            this.modifiedCommands.set(command.command, regInfo);
        } else {
            this.providedCommands.get(appId).get(command.command).slashCommand = command;
        }

        this.setAsTouched(appId, command.command);
    }

    /**
     * Goes and enables a command in the bridged system. The command
     * which is being enabled must either be the App's or a system
     * command which has yet to be touched by an App.
     *
     * @param appId the id of the app enabling the command
     * @param command the command which is being enabled
     */
    public enableCommand(appId: string, command: string): void {
        const cmd = command.toLowerCase().trim();

        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, cmd)) {
            throw new CommandHasAlreadyBeenTouchedError(cmd);
        }

        // Handle if the App provided the command fist
        if (this.providedCommands.has(appId) && this.providedCommands.get(appId).has(cmd)) {
            const cmdInfo = this.providedCommands.get(appId).get(cmd);

            // A command marked as disabled can then be "enabled" but not be registered.
            // This happens when an App is not enabled and they change the status of
            // command based upon a setting they provide which a User can change.
            if (!cmdInfo.isRegistered) {
                cmdInfo.isDisabled = false;
                cmdInfo.isEnabled = true;
            }

            return;
        }

        if (!this.bridge.doesCommandExist(cmd, appId)) {
            throw new Error(`The command "${cmd}" does not exist to enable.`);
        }

        this.bridge.enableCommand(cmd, appId);
        this.setAsTouched(appId, cmd);
    }

    /**
     * Renders an existing slash command un-usable. Whether that command is provided
     * by the App calling this or a command provided by the bridged system, we don't care.
     * However, an App can not disable a command which has already been touched
     * by another App in some way.
     *
     * @param appId the app's id which is disabling the command
     * @param command the command to disable in the bridged system
     */
    public disableCommand(appId: string, command: string): void {
        const cmd = command.toLowerCase().trim();

        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, cmd)) {
            throw new CommandHasAlreadyBeenTouchedError(cmd);
        }

        // Handle if the App provided the command fist
        if (this.providedCommands.has(appId) && this.providedCommands.get(appId).has(cmd)) {
            const cmdInfo = this.providedCommands.get(appId).get(cmd);

            // A command marked as enabled can then be "disabled" but not yet be registered.
            // This happens when an App is not enabled and they change the status of
            // command based upon a setting they provide which a User can change.
            if (!cmdInfo.isRegistered) {
                cmdInfo.isDisabled = true;
                cmdInfo.isEnabled = false;
            }

            return;
        }

        if (!this.bridge.doesCommandExist(cmd, appId)) {
            throw new Error(`The command "${cmd}" does not exist to disable.`);
        }

        this.bridge.disableCommand(cmd, appId);
        this.setAsTouched(appId, cmd);
    }

    /**
     * Registers all of the commands for the provided app inside
     * of the bridged system which then enables them.
     *
     * @param appId The app's id of which to register it's commands with the bridged system
     */
    public registerCommands(appId: string): void {
        if (!this.providedCommands.has(appId)) {
            return;
        }

        this.providedCommands.get(appId).forEach((r) => {
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
        if (this.providedCommands.has(appId)) {
            this.providedCommands.get(appId).forEach((r) => {
                this.bridge.unregisterCommand(r.slashCommand.command, appId);
                this.touchedCommandsToApps.delete(r.slashCommand.command);
                const ind = this.appsTouchedCommands.get(appId).indexOf(r.slashCommand.command);
                this.appsTouchedCommands.get(appId).splice(ind, 1);
                r.isRegistered = true;
            });

            this.providedCommands.delete(appId);
        }

        if (this.appsTouchedCommands.has(appId)) {
            // The commands inside the appsTouchedCommands should now
            // only be the ones which the App has enabled, disabled, or modified.
            // We call restore to enable the commands provided by the bridged system
            // or unmodify the commands modified by the App
            this.appsTouchedCommands.get(appId).forEach((cmd) => {
                this.bridge.restoreCommand(cmd, appId);
                this.modifiedCommands.get(cmd).isRegistered = false;
                this.modifiedCommands.delete(cmd);
                this.touchedCommandsToApps.delete(cmd);
            });

            this.appsTouchedCommands.delete(appId);
        }
    }

    /**
     * Executes an App's command.
     *
     * @param command the command to execute
     * @param context the context in which the command was entered
     */
    public async executeCommand(command: string, context: SlashCommandContext): Promise<void> {
        const cmd = command.toLowerCase().trim();

        // None of the Apps have touched the command to execute,
        // thus we don't care so exit out
        if (!this.touchedCommandsToApps.has(cmd)) {
            return;
        }

        const appId = this.touchedCommandsToApps.get(cmd);
        const cmdInfo = this.modifiedCommands.get(cmd) || this.providedCommands.get(appId).get(cmd);

        // Should the command information really not exist
        // Or if the command hasn't been registered
        // Or the command is disabled on our side
        // then let's not execute it, as the App probably doesn't want it yet
        if (!cmdInfo || !cmdInfo.isRegistered || cmdInfo.isDisabled) {
            return;
        }

        const app = this.manager.getOneById(appId);
        const { slashCommand } = cmdInfo;
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
     * Sets that an App has been touched.
     *
     * @param appId the app's id which has touched the command
     * @param command the command, lowercase and trimmed, which has been touched
     */
    private setAsTouched(appId: string, command: string): void {
        if (!this.appsTouchedCommands.has(appId)) {
            this.appsTouchedCommands.set(appId, new Array<string>());
        }

        if (!this.appsTouchedCommands.get(appId).includes(command)) {
            this.appsTouchedCommands.get(appId).push(command);
        }

        this.touchedCommandsToApps.set(command, appId);
    }

    /**
     * Actually goes and provide's the bridged system with the command information.
     *
     * @param appId the app which is providing the command
     * @param info the command's registration information
     */
    private registerCommand(appId: string, info: AppSlashCommandRegistration): void {
        this.bridge.registerCommand(info.slashCommand, appId);
        info.hasBeenRegistered();
    }
}
