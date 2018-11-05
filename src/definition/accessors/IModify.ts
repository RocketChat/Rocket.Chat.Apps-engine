import { IConfigurationModify } from './IConfigurationModify';
import { IModifyCreator } from './IModifyCreator';
import { IModifyExtender } from './IModifyExtender';
import { IModifyUpdater } from './IModifyUpdater';
import { INotifier } from './INotifier';

// These are here in order to provide backwards compatibility, as they used to live
// inside of this file before they were refactored out.
export { INotifier } from './INotifier';
export { IModifyUpdater } from './IModifyUpdater';
export { IModifyExtender } from './IModifyExtender';
export { IModifyCreator } from './IModifyCreator';
export { IMessageExtender } from './IMessageExtender';
export { IRoomExtender } from './IRoomExtender';
export { IMessageBuilder } from './IMessageBuilder';
export { IRoomBuilder } from './IRoomBuilder';

export interface IModify {
    getCreator(): IModifyCreator;

    getExtender(): IModifyExtender;

    getUpdater(): IModifyUpdater;

    getConfiguration(): IConfigurationModify;

    /**
     * Gets the accessor for sending notifications to a user or users in a room.
     *
     * @returns the notifier accessor
     */
    getNotifier(): INotifier;
}
