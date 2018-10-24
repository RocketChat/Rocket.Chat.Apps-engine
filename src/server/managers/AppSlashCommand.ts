import { AppMethod } from '../../definition/metadata';
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from '../../definition/slashcommands';

import { ProxiedApp } from '../ProxiedApp';
import { AppLogStorage } from '../storage';
import { AppAccessorManager } from './AppAccessorManager';

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

    public async runExecutorOrPreviewer(method: AppMethod._COMMAND_EXECUTOR | AppMethod._COMMAND_PREVIEWER,
                                        context: SlashCommandContext, logStorage: AppLogStorage,
                                        accessors: AppAccessorManager): Promise<void | ISlashCommandPreview> {

        return await this.runTheCode(method, logStorage, accessors, context, new Array());
    }

    public async runPreviewExecutor(previewItem: ISlashCommandPreviewItem, context: SlashCommandContext,
                                    logStorage: AppLogStorage, accessors: AppAccessorManager): Promise<void> {

        await this.runTheCode(AppMethod._COMMAND_PREVIEW_EXECUTOR, logStorage, accessors, context, [previewItem]);
        return;
    }

    private async runTheCode(method: AppMethod._COMMAND_EXECUTOR | AppMethod._COMMAND_PREVIEWER | AppMethod._COMMAND_PREVIEW_EXECUTOR,
                             logStorage: AppLogStorage, accessors: AppAccessorManager,
                             context: SlashCommandContext, runContextArgs: Array<any>): Promise<void | ISlashCommandPreview> {
        const command = this.slashCommand.command;

        // Ensure the slash command has the property before going on
        if (typeof this.slashCommand[method] !== 'function') {
            return;
        }

        const runContext = this.app.makeContext({
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

        const logger = this.app.setupLogger(method);
        logger.debug(`${ command }'s ${ method } is being executed...`, context);

        let result: void | ISlashCommandPreview;
        try {
            const runCode = `slashCommand.${ method }.apply(slashCommand, args)`;
            result = await this.app.runInContext(runCode, runContext);
            logger.debug(`${ command }'s ${ method } was successfully executed.`);
        } catch (e) {
            logger.error(e);
            logger.debug(`${ command }'s ${ method } was unsuccessful.`);
        }

        try {
            await logStorage.storeEntries(this.app.getID(), logger);
        } catch (e) {
            // Don't care, at the moment.
            // TODO: Evaluate to determine if we do care
        }

        return result;
    }
}
