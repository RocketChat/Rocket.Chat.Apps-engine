import { ISlashCommand } from 'temporary-rocketlets-ts-definition/slashcommands';

/**
 * The interface which should be implemented for the commands to be
 * registered, unregistered, and a check to see if a command exists.
 */
export interface IRocketletCommandBridge {
    /**
     * Checks if the provided command already exists inside of the
     * system which is being bridged. This does not check if the rocketlet
     * registered it but it should return whether the supplied command is
     * already defined by something else or not.
     *
     * @param command the command to check if it exists
     * @param rocketletId the id of the rocketlet calling this
     * @return whether the command is already in the system
     */
    doesCommandExist(command: string, rocketletId: string): boolean;

    /**
     * Enables an existing command from the bridged system.
     *
     * @param command the command to enable
     * @param rocketletId the id of the rocketlet calling this
     */
    enableCommand(command: string, rocketletId: string): void;

    /**
     * Disables an existing command from the bridged system.
     *
     * @param command the command which to disable
     * @param rocketletId the id of the rocketlet calling this
     */
    disableCommand(command: string, rocketletId: string): void;

    /**
     * Changes how an existing slash command behaves, so you can provide
     * different executor per configuration.
     *
     * @param command the modified slash command
     * @param rocketletId the id of the rocketlet calling this
     */
    modifyCommand(command: ISlashCommand, rocketletId: string): void;

    /**
     * Registers a command with the system which is being bridged.
     *
     * @param command the command to register
     * @param rocketletId the id of the rocketlet calling this
     * @param toRun the executor which is called when the command is ran
     */
    registerCommand(command: ISlashCommand, rocketletId: string): void;

    /**
     * Unregisters the provided command from the bridged system.
     *
     * @param command the command to unregister
     * @param rocketletId the id of the rocketlet calling this
     */
    unregisterCommand(command: string, rocketletId: string): void;
}
