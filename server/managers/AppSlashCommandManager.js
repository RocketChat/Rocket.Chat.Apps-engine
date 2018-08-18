"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppStatus_1 = require("../../definition/AppStatus");
const metadata_1 = require("../../definition/metadata");
const errors_1 = require("../errors");
const AppSlashCommand_1 = require("./AppSlashCommand");
/**
 * The command manager for the Apps.
 *
 * An App will add commands during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's commands be enabled.
 *
 * Registered means the command has been provided to the bridged system.
 */
class AppSlashCommandManager {
    constructor(manager) {
        this.manager = manager;
        this.bridge = this.manager.getBridges().getCommandBridge();
        this.accessors = this.manager.getAccessorManager();
        this.touchedCommandsToApps = new Map();
        this.appsTouchedCommands = new Map();
        this.providedCommands = new Map();
        this.modifiedCommands = new Map();
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
    canCommandBeTouchedBy(appId, command) {
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
    isAlreadyDefined(command) {
        const search = command.toLowerCase().trim();
        let exists = false;
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
    addCommand(appId, command) {
        command.command = command.command.toLowerCase().trim();
        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, command.command)) {
            throw new errors_1.CommandHasAlreadyBeenTouchedError(command.command);
        }
        // Verify the command doesn't exist already
        if (this.bridge.doesCommandExist(command.command, appId) || this.isAlreadyDefined(command.command)) {
            throw new errors_1.CommandAlreadyExistsError(command.command);
        }
        const app = this.manager.getOneById(appId);
        if (!app) {
            throw new Error('App must exist in order for a command to be added.');
        }
        if (!this.providedCommands.has(appId)) {
            this.providedCommands.set(appId, new Map());
        }
        this.providedCommands.get(appId).set(command.command, new AppSlashCommand_1.AppSlashCommand(app, command));
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
    modifyCommand(appId, command) {
        command.command = command.command.toLowerCase().trim();
        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, command.command)) {
            throw new errors_1.CommandHasAlreadyBeenTouchedError(command.command);
        }
        const app = this.manager.getOneById(appId);
        if (!app) {
            throw new Error('App must exist in order to modify a command.');
        }
        const hasNotProvidedIt = !this.providedCommands.has(appId) || !this.providedCommands.get(appId).has(command.command);
        // They haven't provided (added) it and the bridged system doesn't have it, error out
        if (hasNotProvidedIt && !this.bridge.doesCommandExist(command.command, appId)) {
            throw new Error('You must first register a command before you can modify it.');
        }
        if (hasNotProvidedIt) {
            this.bridge.modifyCommand(command, appId);
            const regInfo = new AppSlashCommand_1.AppSlashCommand(app, command);
            regInfo.isDisabled = false;
            regInfo.isEnabled = true;
            regInfo.isRegistered = true;
            this.modifiedCommands.set(command.command, regInfo);
        }
        else {
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
    enableCommand(appId, command) {
        const cmd = command.toLowerCase().trim();
        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, cmd)) {
            throw new errors_1.CommandHasAlreadyBeenTouchedError(cmd);
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
    disableCommand(appId, command) {
        const cmd = command.toLowerCase().trim();
        // Ensure the app can touch this command
        if (!this.canCommandBeTouchedBy(appId, cmd)) {
            throw new errors_1.CommandHasAlreadyBeenTouchedError(cmd);
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
    registerCommands(appId) {
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
    unregisterCommands(appId) {
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
    executeCommand(command, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = command.toLowerCase().trim();
            if (!this.shouldCommandFunctionsRun(cmd)) {
                return;
            }
            const app = this.manager.getOneById(this.touchedCommandsToApps.get(cmd));
            if (!app || AppStatus_1.AppStatusUtils.isDisabled(app.getStatus())) {
                // Just in case someone decides to do something they shouldn't
                // let's ensure the app actually exists
                return;
            }
            const appCmd = this.retrieveCommandInfo(cmd, app.getID());
            yield appCmd.runExecutorOrPreviewer(metadata_1.AppMethod._COMMAND_EXECUTOR, context, this.manager.getLogStorage(), this.accessors);
            return;
        });
    }
    getPreviews(command, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = command.toLowerCase().trim();
            if (!this.shouldCommandFunctionsRun(cmd)) {
                return;
            }
            const app = this.manager.getOneById(this.touchedCommandsToApps.get(cmd));
            if (!app || AppStatus_1.AppStatusUtils.isDisabled(app.getStatus())) {
                // Just in case someone decides to do something they shouldn't
                // let's ensure the app actually exists
                return;
            }
            const appCmd = this.retrieveCommandInfo(cmd, app.getID());
            const result = yield appCmd.runExecutorOrPreviewer(metadata_1.AppMethod._COMMAND_PREVIEWER, context, this.manager.getLogStorage(), this.accessors);
            if (!result) {
                // Failed to get the preview, thus returning is fine
                return;
            }
            return result;
        });
    }
    executePreview(command, previewItem, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmd = command.toLowerCase().trim();
            if (!this.shouldCommandFunctionsRun(cmd)) {
                return;
            }
            const app = this.manager.getOneById(this.touchedCommandsToApps.get(cmd));
            if (!app || AppStatus_1.AppStatusUtils.isDisabled(app.getStatus())) {
                // Just in case someone decides to do something they shouldn't
                // let's ensure the app actually exists
                return;
            }
            const appCmd = this.retrieveCommandInfo(cmd, app.getID());
            yield appCmd.runPreviewExecutor(previewItem, context, this.manager.getLogStorage(), this.accessors);
            return;
        });
    }
    /**
     * Determines if the command's functions should run,
     * this way the code isn't duplicated three times.
     *
     * @param command the lowercase and trimmed command
     * @returns whether or not to continue
     */
    shouldCommandFunctionsRun(command) {
        // None of the Apps have touched the command to execute,
        // thus we don't care so exit out
        if (!this.touchedCommandsToApps.has(command)) {
            return false;
        }
        const appId = this.touchedCommandsToApps.get(command);
        const cmdInfo = this.retrieveCommandInfo(command, appId);
        // Should the command information really not exist
        // Or if the command hasn't been registered
        // Or the command is disabled on our side
        // then let's not execute it, as the App probably doesn't want it yet
        if (!cmdInfo || !cmdInfo.isRegistered || cmdInfo.isDisabled) {
            return false;
        }
        return true;
    }
    retrieveCommandInfo(command, appId) {
        return this.modifiedCommands.get(command) || this.providedCommands.get(appId).get(command);
    }
    /**
     * Sets that an App has been touched.
     *
     * @param appId the app's id which has touched the command
     * @param command the command, lowercase and trimmed, which has been touched
     */
    setAsTouched(appId, command) {
        if (!this.appsTouchedCommands.has(appId)) {
            this.appsTouchedCommands.set(appId, new Array());
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
    registerCommand(appId, info) {
        this.bridge.registerCommand(info.slashCommand, appId);
        info.hasBeenRegistered();
    }
}
exports.AppSlashCommandManager = AppSlashCommandManager;

//# sourceMappingURL=AppSlashCommandManager.js.map
