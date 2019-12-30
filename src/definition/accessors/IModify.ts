import { IModifyCreator } from './IModifyCreator';
import { IModifyExtender } from './IModifyExtender';
import { IModifyUpdater } from './IModifyUpdater';
import { INotifier } from './INotifier';
import { IUIController } from './IUIController';

export interface IModify {
    getCreator(): IModifyCreator;

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
}
