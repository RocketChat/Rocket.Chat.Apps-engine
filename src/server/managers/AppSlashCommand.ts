import { AppMethod } from '../../definition/metadata';
import type { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from '../../definition/slashcommands';
import type { ProxiedApp } from '../ProxiedApp';
import type { AppLogStorage } from '../storage';
import type { AppAccessorManager } from './AppAccessorManager';

export class AppSlashCommand {
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

    constructor(public app: ProxiedApp, public slashCommand: ISlashCommand) {
        this.isRegistered = false;
        this.isEnabled = false;
        this.isDisabled = false;
    }

    public hasBeenRegistered(): void {
        this.isDisabled = false;
        this.isEnabled = true;
        this.isRegistered = true;
    }

    public canBeRan(method: AppMethod): boolean {
        return this.app.hasMethod(method);
    }

    public async runExecutorOrPreviewer(
        method: AppMethod._COMMAND_EXECUTOR | AppMethod._COMMAND_PREVIEWER,
        context: SlashCommandContext,
        logStorage: AppLogStorage,
        accessors: AppAccessorManager,
    ): Promise<void | ISlashCommandPreview> {
        return this.runTheCode(method, logStorage, accessors, context, []);
    }

    public async runPreviewExecutor(
        previewItem: ISlashCommandPreviewItem,
        context: SlashCommandContext,
        logStorage: AppLogStorage,
        accessors: AppAccessorManager,
    ): Promise<void> {
        await this.runTheCode(AppMethod._COMMAND_PREVIEW_EXECUTOR, logStorage, accessors, context, [previewItem]);
    }

    private async runTheCode(
        method: AppMethod._COMMAND_EXECUTOR | AppMethod._COMMAND_PREVIEWER | AppMethod._COMMAND_PREVIEW_EXECUTOR,
        logStorage: AppLogStorage,
        accessors: AppAccessorManager,
        context: SlashCommandContext,
        runContextArgs: Array<any>,
    ): Promise<void | ISlashCommandPreview> {
        const { command } = this.slashCommand;

        // Ensure the slash command has the property before going on
        if (typeof this.slashCommand[method] !== 'function') {
            return;
        }

        const logger = this.app.setupLogger(method);
        logger.debug(`${command}'s ${method} is being executed...`, context);

        try {
            const runCode = `module.exports = slashCommand.${method}.apply(slashCommand, args)`;
            const result = await this.app.getRuntime().runInSandbox(runCode, {
                slashCommand: this.slashCommand,
                args: [
                    ...runContextArgs,
                    context,
                    accessors.getReader(this.app.getID()),
                    accessors.getModifier(this.app.getID()),
                    accessors.getHttp(this.app.getID()),
                    accessors.getPersistence(this.app.getID()),
                ],
            });

            logger.debug(`${command}'s ${method} was successfully executed.`);
            return result;
        } catch (e) {
            logger.error(e);
            logger.debug(`${command}'s ${method} was unsuccessful.`);
        } finally {
            await logStorage.storeEntries(this.app.getID(), logger);
        }
    }
}
