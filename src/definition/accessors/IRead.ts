import { IEnvironmentRead } from './IEnvironmentRead';
import { ILivechatRead } from './ILivechatRead';
import { IMessageRead } from './IMessageRead';
import { INotifier } from './INotifier';
import { IPersistenceRead } from './IPersistenceRead';
import { IRoomRead } from './IRoomRead';
import { ISchedulerRead } from './ISchedulerRead';
import { IUploadRead } from './IUploadRead';
import { IUserRead } from './IUserRead';

/**
 * The IRead accessor provides methods for accessing the
 * Rocket.Chat's environment in a read-only-fashion.
 * It is safe to be injected in multiple places, idempotent and extensible
 */
export interface IRead {
    /** Gets the IEnvironmentRead instance, contains settings and environmental variables. */
    getEnvironmentReader(): IEnvironmentRead;

    /** Gets the IMessageRead instance. */
    getMessageReader(): IMessageRead;

    /** Gets the IPersistenceRead instance. */
    getPersistenceReader(): IPersistenceRead;

    /** Gets the IRoomRead instance. */
    getRoomReader(): IRoomRead;

    /** Gets the IUserRead instance. */
    getUserReader(): IUserRead;

    /** Gets the INotifier for notifying users/rooms. */
    getNotifier(): INotifier;

    /** Gets the ILivechatRead instance. */
    getLivechatReader(): ILivechatRead;

    /** Gets the IUploadRead instance. */
    getUploadReader(): IUploadRead;

    /** Gets the ISchedulerRead instance. */
    getSchedulerReader(): ISchedulerRead;
}
