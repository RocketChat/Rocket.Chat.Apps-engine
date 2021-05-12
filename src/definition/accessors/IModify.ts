import { IModifyCreator } from './IModifyCreator';
import { IModifyDeleter } from './IModifyDeleter';
import { IModifyExtender } from './IModifyExtender';
import { IModifyUpdater } from './IModifyUpdater';
import { INotifier } from './INotifier';
import { ISchedulerModify } from './ISchedulerModify';
import { IUIController } from './IUIController';

export interface IModify {
    getCreator(): IModifyCreator;

    getDeleter(): IModifyDeleter;

    getExtender(): IModifyExtender;

    getUpdater(): IModifyUpdater;

    /**
     * Gets the accessor for sending notifications to a user or users in a room.
     *
     * @returns the notifier accessor
     */
    getNotifier(): INotifier;
    /**
     * Gets the accessor for interacting with the UI
     */
    getUiController(): IUIController;

    /**
     * Gets the accessor for creating scheduled jobs
     */
    getScheduler(): ISchedulerModify;
}
