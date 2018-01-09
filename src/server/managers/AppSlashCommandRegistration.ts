import { ISlashCommand } from '@rocket.chat/apps-ts-definition/slashcommands';

export class AppSlashCommandRegistration {
    /**
     * States whether this command has been registered into the Rocket.Chat system or not.
     */
    public isRegistered: boolean;

    /**
     * Declares whether this command has been enabled or not,
     * does not have to be inside of the Rocket.Chat system if `isRegistered` is false.
     */
    public isEnabled: boolean;

    /**
     * Proclaims whether this command has been disabled or not,
     * does not have to be inside the Rocket.Chat system if `isRegistered` is false.
     */
    public isDisabled: boolean;

    constructor(public slashCommand: ISlashCommand) {
        this.isRegistered = false;
        this.isEnabled = false;
        this.isDisabled = false;
    }
}
