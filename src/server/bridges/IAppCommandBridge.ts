import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';

/**
 * The interface which should be implemented for the commands to be
 * registered, unregistered, and a check to see if a command exists.
 */
export interface IAppCommandBridge {
    /**
     * Checks if the provided command already exists inside of the
     * system which is being bridged. This does not check if the app
     * registered it but it should return whether the supplied command is
     * already defined by something else or not.
     *
     * @param command the command to check if it exists
     * @param appId the id of the app calling this
     * @return whether the command is already in the system
     */
    doesCommandExist(command: string, appId: string): boolean;

    /**
     * Enables an existing command from the bridged system.
     *
     * @param command the command to enable
     * @param appId the id of the app calling this
     */
    enableCommand(command: string, appId: string): void;

    /**
     * Disables an existing command from the bridged system.
     *
     * @param command the command which to disable
     * @param appId the id of the app calling this
     */
    disableCommand(command: string, appId: string): void;

    /**
     * Changes how an existing slash command behaves, so you can provide
     * different executor per configuration.
     *
     * @param command the modified slash command
     * @param appId the id of the app calling this
     */
    modifyCommand(command: ISlashCommand, appId: string): void;

    /**
     * Registers a command with the system which is being bridged.
     *
     * @param command the command to register
     * @param appId the id of the app calling this
     * @param toRun the executor which is called when the command is ran
     */
    registerCommand(command: ISlashCommand, appId: string): void;

    /**
     * Unregisters the provided command from the bridged system.
     *
     * @param command the command to unregister
     * @param appId the id of the app calling this
     */
    unregisterCommand(command: string, appId: string): void;
}
