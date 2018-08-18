import { ISlashCommand } from '../../definition/slashcommands';
/**
 * The interface which should be implemented for the commands to be
 * registered, unregistered, and a check to see if a command exists.
 */
export interface IAppCommandBridge {
    /**
     * Checks if the provided command already exists inside of the
     * system which is being bridged. This does not check if the app
     * registered it but it will return whether the supplied command is
     * already defined by something else or not.
     *
     * @param command the command to check if it exists
     * @param appId the id of the app calling this
     * @returns whether the command is already in the system
     */
    doesCommandExist(command: string, appId: string): boolean;
    /**
     * Enables an existing command from the bridged system. The callee
     * must ensure that the command that's being enabled is defined by
     * the bridged system and not another App since the bridged system
     * will not check that.
     *
     * @param command the command to enable
     * @param appId the id of the app calling this
     */
    enableCommand(command: string, appId: string): void;
    /**
     * Disables an existing command from the bridged system, the callee must
     * ensure the command disabling is defined by the system and not another
     * App since the bridged system won't check that.
     *
     * @param command the command which to disable
     * @param appId the id of the app calling this
     */
    disableCommand(command: string, appId: string): void;
    /**
     * Changes how a system slash command behaves, allows Apps to provide
     * different executors per system commands.
     *
     * @param command the modified slash command
     * @param appId the id of the app calling this
     */
    modifyCommand(command: ISlashCommand, appId: string): void;
    /**
     * Restores a system slash command back to it's default behavior.
     * This includes "unmodifying" a command and also enabling a
     * command again if it was disabled.
     *
     * @param command the command to restore
     * @param appId the id of the app which modified it
     */
    restoreCommand(command: string, appId: string): void;
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
