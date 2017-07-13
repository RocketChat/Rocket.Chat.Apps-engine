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
     * @param rocketletId the id of the rocketlet calling this
     * @return whether the command is already in the system
     */
    doesCommandExist(command: string, rocketletId: string): boolean;

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
    // tslint:disable-next-line:max-line-length
    registerCommand(command: string, rocketletId: string, executor: (command: string, context: ISlashCommandContext) => {}): void;

    /**
     * Unregisters the provided command from the bridged system.
     *
     * @param command the command to unregister
     * @param rocketletId the id of the rocketlet calling this
     */
    unregisterCommand(command: string, rocketletId: string): void;

    /**
     * Unregisters all of the commands which were registered by the
     * provided rocketlet.
     *
     * @param rocketletId the rocketlet's id to unregister the commands
     * @return the amount of commands unregistered
     */
    unregisterCommands(rocketletId: string): number;
}
