import { ISlashCommand, ISlashCommandContext } from 'temporary-rocketlets-ts-definition/slashcommands';

/**
 * The interface which should be implemented for the commands to be
 * registered, unregistered, and a check to see if a command exists.
 */
export interface IRocketletCommandBridge {
    /**
     * Checks if the provided command already exists inside of the
     * system which is being bridged.
     *
     * @param command the command to check if it exists
     * @return whether the command is already in the system
     */
    doesCommandExist(command: string): boolean;

    /**
     * Registers a command with the system which is being bridged.
     *
     * @param command the command to register
     * @param toRun the executor which is called when the command is ran
     */
    registerCommand(command: string, executor: (command: string, context: ISlashCommandContext) => {}): void;

    /**
     * Unregisters the provided command from the bridged system.
     *
     * @param command the command to unregister
     */
    unregisterCommand(command: string): void;

    /**
     * Disables an existing command from the bridged system.
     *
     * @param rocketletId the id of the rocketlet which is disabling this command
     * @param command the command which to disable
     */
    disableCommand(rocketletId: string, command: string): void;
}
