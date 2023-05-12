import { IEmailDescriptor, IPreEmailSentContext } from '../../definition/email';
import { EssentialAppDisabledException } from '../../definition/exceptions';
import { IExternalComponent } from '../../definition/externalComponent';
import { ILivechatEventContext, ILivechatRoom, ILivechatTransferEventContext, IVisitor } from '../../definition/livechat';
import {
    IMessage,
    IMessageDeleteContext,
    IMessageFollowContext,
    IMessagePinContext,
    IMessageReactionContext,
    IMessageReportContext,
    IMessageStarContext,
} from '../../definition/messages';
import { AppInterface, AppMethod } from '../../definition/metadata';
import { IRoom, IRoomUserJoinedContext, IRoomUserLeaveContext } from '../../definition/rooms';
import { UIActionButtonContext } from '../../definition/ui';
import { IUIKitIncomingInteraction, IUIKitResponse, IUIKitSurface, UIKitIncomingInteractionType } from '../../definition/uikit';
import { IUIKitLivechatIncomingInteraction, UIKitLivechatBlockInteractionContext } from '../../definition/uikit/livechat';
import { IUIKitIncomingInteractionMessageContainer, IUIKitIncomingInteractionModalContainer } from '../../definition/uikit/UIKitIncomingInteractionContainer';
import {
    UIKitActionButtonInteractionContext,
    UIKitBlockInteractionContext,
    UIKitViewCloseInteractionContext,
    UIKitViewSubmitInteractionContext,
} from '../../definition/uikit/UIKitInteractionContext';
import { IFileUploadContext } from '../../definition/uploads/IFileUploadContext';
import { IUser, IUserContext, IUserStatusContext, IUserUpdateContext } from '../../definition/users';
import { MessageBuilder, MessageExtender, RoomBuilder, RoomExtender } from '../accessors';
import { AppManager } from '../AppManager';
import { Message } from '../messages/Message';
import { Utilities } from '../misc/Utilities';
import { ProxiedApp } from '../ProxiedApp';
import { Room } from '../rooms/Room';
import { AppAccessorManager } from './AppAccessorManager';

type EventData =
    | IMessage
    | IRoom
    | IUser
    | IVisitor
    | ILivechatRoom
    | IUIKitIncomingInteraction
    | IUIKitLivechatIncomingInteraction
    | IExternalComponent
    | ILivechatEventContext
    | IRoomUserJoinedContext
    | IRoomUserLeaveContext
    | ILivechatTransferEventContext
    | IFileUploadContext
    | IPreEmailSentContext
    | IMessageReactionContext
    | IMessageFollowContext
    | IMessagePinContext
    | IMessageStarContext
    | IMessageReportContext
    | IMessageDeleteContext
    | IUserContext
    | IUserUpdateContext
    | IUserStatusContext;

type EventReturn = void | boolean | IMessage | IRoom | IUser | IUIKitResponse | ILivechatRoom | IEmailDescriptor;

export class AppListenerManager {
    private am: AppAccessorManager;
    private listeners: Map<string, Array<string>>;
    /**
     * Locked events are those who are listed in an app's
     * "essentials" list but the app is disabled.
     *
     * They will throw a EssentialAppDisabledException upon call
     */
    private lockedEvents: Map<string, Set<string>>;

    constructor(private readonly manager: AppManager) {
        this.am = manager.getAccessorManager();
        this.listeners = new Map<string, Array<string>>();
        this.lockedEvents = new Map<string, Set<string>>();

        Object.keys(AppInterface).forEach((intt) => {
            this.listeners.set(intt, new Array<string>());
            this.lockedEvents.set(intt, new Set<string>());
        });
    }

    public registerListeners(app: ProxiedApp): void {
        this.unregisterListeners(app);

        Object.entries(app.getImplementationList()).forEach(([event, isImplemented]) => {
            if (!isImplemented) {
                return;
            }

            this.listeners.get(event).push(app.getID());
        });
    }

    public unregisterListeners(app: ProxiedApp): void {
        this.listeners.forEach((apps, int) => {
            if (apps.includes(app.getID())) {
                const where = apps.indexOf(app.getID());
                this.listeners.get(int).splice(where, 1);
            }
        });
    }

    public releaseEssentialEvents(app: ProxiedApp): void {
        if (!app.getEssentials()) {
            return;
        }

        app.getEssentials().forEach((event) => {
            const lockedEvent = this.lockedEvents.get(event);

            if (!lockedEvent) {
                return;
            }

            lockedEvent.delete(app.getID());
        });
    }

    public lockEssentialEvents(app: ProxiedApp): void {
        if (!app.getEssentials()) {
            return;
        }

        app.getEssentials().forEach((event) => {
            const lockedEvent = this.lockedEvents.get(event);

            if (!lockedEvent) {
                return;
            }

            lockedEvent.add(app.getID());
        });
    }

    public getListeners(int: AppInterface): Array<ProxiedApp> {
        const results = new Array<ProxiedApp>();

        for (const appId of this.listeners.get(int)) {
            results.push(this.manager.getOneById(appId));
        }

        return results;
    }

    public isEventBlocked(event: AppInterface): boolean {
        const lockedEventList = this.lockedEvents.get(event);

        return !!(lockedEventList && lockedEventList.size);
    }

    public async executeListener(int: AppInterface, data: EventData): Promise<EventReturn> {
        if (this.isEventBlocked(int)) {
            throw new EssentialAppDisabledException('There is one or more apps that are essential to this event but are disabled');
        }

        switch (int) {
            // Messages
            case AppInterface.IPreMessageSentPrevent:
                return this.executePreMessageSentPrevent(data as IMessage);
            case AppInterface.IPreMessageSentExtend:
                return this.executePreMessageSentExtend(data as IMessage);
            case AppInterface.IPreMessageSentModify:
                return this.executePreMessageSentModify(data as IMessage);
            case AppInterface.IPostMessageSent:
                this.executePostMessageSent(data as IMessage);
                return;
            case AppInterface.IPreMessageDeletePrevent:
                return this.executePreMessageDeletePrevent(data as IMessage);
            case AppInterface.IPostMessageDeleted:
                this.executePostMessageDelete(data as IMessageDeleteContext);
                return;
            case AppInterface.IPreMessageUpdatedPrevent:
                return this.executePreMessageUpdatedPrevent(data as IMessage);
            case AppInterface.IPreMessageUpdatedExtend:
                return this.executePreMessageUpdatedExtend(data as IMessage);
            case AppInterface.IPreMessageUpdatedModify:
                return this.executePreMessageUpdatedModify(data as IMessage);
            case AppInterface.IPostMessageUpdated:
                this.executePostMessageUpdated(data as IMessage);
                return;
            case AppInterface.IPostMessageReacted:
                return this.executePostMessageReacted(data as IMessageReactionContext);
            case AppInterface.IPostMessageFollowed:
                return this.executePostMessageFollowed(data as IMessageFollowContext);
            case AppInterface.IPostMessagePinned:
                return this.executePostMessagePinned(data as IMessagePinContext);
            case AppInterface.IPostMessageStarred:
                return this.executePostMessageStarred(data as IMessageStarContext);
            case AppInterface.IPostMessageReported:
                return this.executePostMessageReported(data as IMessageReportContext);
            // Rooms
            case AppInterface.IPreRoomCreatePrevent:
                return this.executePreRoomCreatePrevent(data as IRoom);
            case AppInterface.IPreRoomCreateExtend:
                return this.executePreRoomCreateExtend(data as IRoom);
            case AppInterface.IPreRoomCreateModify:
                return this.executePreRoomCreateModify(data as IRoom);
            case AppInterface.IPostRoomCreate:
                this.executePostRoomCreate(data as IRoom);
                return;
            case AppInterface.IPreRoomDeletePrevent:
                return this.executePreRoomDeletePrevent(data as IRoom);
            case AppInterface.IPostRoomDeleted:
                this.executePostRoomDeleted(data as IRoom);
                return;
            case AppInterface.IPreRoomUserJoined:
                return this.executePreRoomUserJoined(data as IRoomUserJoinedContext);
            case AppInterface.IPostRoomUserJoined:
                return this.executePostRoomUserJoined(data as IRoomUserJoinedContext);
            case AppInterface.IPreRoomUserLeave:
                return this.executePreRoomUserLeave(data as IRoomUserLeaveContext);
            case AppInterface.IPostRoomUserLeave:
                return this.executePostRoomUserLeave(data as IRoomUserLeaveContext);
            // External Components
            case AppInterface.IPostExternalComponentOpened:
                this.executePostExternalComponentOpened(data as IExternalComponent);
                return;
            case AppInterface.IPostExternalComponentClosed:
                this.executePostExternalComponentClosed(data as IExternalComponent);
                return;
            case AppInterface.IUIKitInteractionHandler:
                return this.executeUIKitInteraction(data as IUIKitIncomingInteraction);
            case AppInterface.IUIKitLivechatInteractionHandler:
                return this.executeUIKitLivechatInteraction(data as IUIKitLivechatIncomingInteraction);
            // Livechat
            case AppInterface.IPostLivechatRoomStarted:
                return this.executePostLivechatRoomStarted(data as ILivechatRoom);
            /**
             * @deprecated please prefer the AppInterface.IPostLivechatRoomClosed event
             */
            case AppInterface.ILivechatRoomClosedHandler:
                return this.executeLivechatRoomClosedHandler(data as ILivechatRoom);
            case AppInterface.IPostLivechatRoomClosed:
                return this.executePostLivechatRoomClosed(data as ILivechatRoom);
            case AppInterface.IPostLivechatRoomSaved:
                return this.executePostLivechatRoomSaved(data as ILivechatRoom);
            case AppInterface.IPostLivechatAgentAssigned:
                return this.executePostLivechatAgentAssigned(data as ILivechatEventContext);
            case AppInterface.IPostLivechatAgentUnassigned:
                return this.executePostLivechatAgentUnassigned(data as ILivechatEventContext);
            case AppInterface.IPostLivechatRoomTransferred:
                return this.executePostLivechatRoomTransferred(data as ILivechatTransferEventContext);
            case AppInterface.IPostLivechatGuestSaved:
                return this.executePostLivechatGuestSaved(data as IVisitor);
            // FileUpload
            case AppInterface.IPreFileUpload:
                return this.executePreFileUpload(data as IFileUploadContext);
            // Email
            case AppInterface.IPreEmailSent:
                return this.executePreEmailSent(data as IPreEmailSentContext);
            // User
            case AppInterface.IPostUserCreated:
                return this.executePostUserCreated(data as IUserContext);
            case AppInterface.IPostUserUpdated:
                return this.executePostUserUpdated(data as IUserContext);
            case AppInterface.IPostUserDeleted:
                return this.executePostUserDeleted(data as IUserContext);
            case AppInterface.IPostUserLoggedIn:
                return this.executePostUserLoggedIn(data as IUser);
            case AppInterface.IPostUserLoggedOut:
                return this.executePostUserLoggedOut(data as IUser);
            case AppInterface.IPostUserStatusChanged:
                return this.executePostUserStatusChanged(data as IUserStatusContext);
            default:
                console.warn('An invalid listener was called');
                return;
        }
    }

    // Messages
    private async executePreMessageSentPrevent(data: IMessage): Promise<boolean> {
        let prevented = false;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentPrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGESENTPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                prevented = (await app.call(
                    AppMethod.EXECUTEPREMESSAGESENTPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePreMessageSentExtend(data: IMessage): Promise<IMessage> {
        const msg = data;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentExtend)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTEXTEND)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGESENTEXTEND, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTEXTEND)) {
                await app.call(
                    AppMethod.EXECUTEPREMESSAGESENTEXTEND,
                    cfMsg,
                    new MessageExtender(msg), // This mutates the passed in object
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }

        return msg;
    }

    private async executePreMessageSentModify(data: IMessage): Promise<IMessage> {
        let msg = data;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentModify)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTMODIFY)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGESENTMODIFY, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTMODIFY)) {
                msg = (await app.call(
                    AppMethod.EXECUTEPREMESSAGESENTMODIFY,
                    cfMsg,
                    new MessageBuilder(msg),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as IMessage;
            }
        }

        return data;
    }

    private async executePostMessageSent(data: IMessage): Promise<void> {
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPostMessageSent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTMESSAGESENT)) {
                continueOn = (await app.call(AppMethod.CHECKPOSTMESSAGESENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGESENT)) {
                await app.call(
                    AppMethod.EXECUTEPOSTMESSAGESENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePreMessageDeletePrevent(data: IMessage): Promise<boolean> {
        let prevented = false;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageDeletePrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGEDELETEPREVENT)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGEDELETEPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEDELETEPREVENT)) {
                prevented = (await app.call(
                    AppMethod.EXECUTEPREMESSAGEDELETEPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePostMessageDelete(data: IMessageDeleteContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);
        const { message } = context;

        for (const appId of this.listeners.get(AppInterface.IPostMessageDeleted)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTMESSAGEDELETED)) {
                continueOn = (await app.call(
                    AppMethod.CHECKPOSTMESSAGEDELETED,
                    // `context` has more information about the event, but
                    // we had to keep this `message` here for compatibility
                    message,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    context,
                )) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGEDELETED)) {
                await app.call(
                    AppMethod.EXECUTEPOSTMESSAGEDELETED,
                    message,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                    context,
                );
            }
        }
    }

    private async executePreMessageUpdatedPrevent(data: IMessage): Promise<boolean> {
        let prevented = false;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageUpdatedPrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGEUPDATEDPREVENT)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGEUPDATEDPREVENT, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT)) {
                prevented = (await app.call(
                    AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePreMessageUpdatedExtend(data: IMessage): Promise<IMessage> {
        const msg = data;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageUpdatedExtend)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGEUPDATEDEXTEND)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGEUPDATEDEXTEND, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND)) {
                await app.call(
                    AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND,
                    cfMsg,
                    new MessageExtender(msg), // This mutates the passed in object
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }

        return msg;
    }

    private async executePreMessageUpdatedModify(data: IMessage): Promise<IMessage> {
        let msg = data;
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreMessageUpdatedModify)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGEUPDATEDMODIFY)) {
                continueOn = (await app.call(AppMethod.CHECKPREMESSAGEUPDATEDMODIFY, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY)) {
                msg = (await app.call(
                    AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY,
                    cfMsg,
                    new MessageBuilder(msg),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as IMessage;
            }
        }

        return data;
    }

    private async executePostMessageUpdated(data: IMessage): Promise<void> {
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPostMessageUpdated)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTMESSAGEUPDATED)) {
                continueOn = (await app.call(AppMethod.CHECKPOSTMESSAGEUPDATED, cfMsg, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGEUPDATED)) {
                await app.call(
                    AppMethod.EXECUTEPOSTMESSAGEUPDATED,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    // Rooms
    private async executePreRoomCreatePrevent(data: IRoom): Promise<boolean> {
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);
        let prevented = false;

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreatePrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEPREVENT)) {
                continueOn = (await app.call(AppMethod.CHECKPREROOMCREATEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEPREVENT)) {
                prevented = (await app.call(
                    AppMethod.EXECUTEPREROOMCREATEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePreRoomCreateExtend(data: IRoom): Promise<IRoom> {
        const room = data;
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreateExtend)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEEXTEND)) {
                continueOn = (await app.call(AppMethod.CHECKPREROOMCREATEEXTEND, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEEXTEND)) {
                await app.call(
                    AppMethod.EXECUTEPREROOMCREATEEXTEND,
                    cfRoom,
                    new RoomExtender(room), // This mutates the passed in object
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }

        return data;
    }

    private async executePreRoomCreateModify(data: IRoom): Promise<IRoom> {
        let room = data;
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreateModify)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEMODIFY)) {
                continueOn = (await app.call(AppMethod.CHECKPREROOMCREATEMODIFY, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEMODIFY)) {
                room = (await app.call(
                    AppMethod.EXECUTEPREROOMCREATEMODIFY,
                    cfRoom,
                    new RoomBuilder(room),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as IRoom;
            }
        }

        return data;
    }

    private async executePostRoomCreate(data: IRoom): Promise<void> {
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPostRoomCreate)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTROOMCREATE)) {
                continueOn = (await app.call(AppMethod.CHECKPOSTROOMCREATE, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTROOMCREATE)) {
                await app.call(
                    AppMethod.EXECUTEPOSTROOMCREATE,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePreRoomDeletePrevent(data: IRoom): Promise<boolean> {
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);
        let prevented = false;

        for (const appId of this.listeners.get(AppInterface.IPreRoomDeletePrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMDELETEPREVENT)) {
                continueOn = (await app.call(AppMethod.CHECKPREROOMDELETEPREVENT, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMDELETEPREVENT)) {
                prevented = (await app.call(
                    AppMethod.EXECUTEPREROOMDELETEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                )) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePostRoomDeleted(data: IRoom): Promise<void> {
        const cfRoom = new Room(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPostRoomDeleted)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTROOMDELETED)) {
                continueOn = (await app.call(AppMethod.CHECKPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId))) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTROOMDELETED)) {
                await app.call(AppMethod.EXECUTEPOSTROOMDELETED, cfRoom, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
            }
        }
    }

    private async executePreRoomUserJoined(externalData: IRoomUserJoinedContext): Promise<void> {
        const data = Utilities.deepClone(externalData);

        data.room = new Room(Utilities.deepFreeze(data.room), this.manager);
        Utilities.deepFreeze(data.joiningUser);

        if (data.inviter) {
            Utilities.deepFreeze(data.inviter);
        }

        for (const appId of this.listeners.get(AppInterface.IPreRoomUserJoined)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_PRE_ROOM_USER_JOINED)) {
                await app.call(AppMethod.EXECUTE_PRE_ROOM_USER_JOINED, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
            }
        }
    }

    private async executePostRoomUserJoined(externalData: IRoomUserJoinedContext): Promise<void> {
        const data = Utilities.deepClone(externalData);

        data.room = new Room(Utilities.deepFreeze(data.room), this.manager);
        Utilities.deepFreeze(data.joiningUser);

        if (data.inviter) {
            Utilities.deepFreeze(data.inviter);
        }

        for (const appId of this.listeners.get(AppInterface.IPostRoomUserJoined)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_ROOM_USER_JOINED)) {
                await app.call(
                    AppMethod.EXECUTE_POST_ROOM_USER_JOINED,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePreRoomUserLeave(externalData: IRoomUserLeaveContext): Promise<void> {
        const data = Utilities.deepClone(externalData);

        data.room = new Room(Utilities.deepFreeze(data.room), this.manager);
        Utilities.deepFreeze(data.leavingUser);

        for (const appId of this.listeners.get(AppInterface.IPreRoomUserLeave)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_PRE_ROOM_USER_LEAVE)) {
                await app.call(AppMethod.EXECUTE_PRE_ROOM_USER_LEAVE, data, this.am.getReader(appId), this.am.getHttp(appId), this.am.getPersistence(appId));
            }
        }
    }

    private async executePostRoomUserLeave(externalData: IRoomUserLeaveContext): Promise<void> {
        const data = Utilities.deepClone(externalData);

        data.room = new Room(Utilities.deepFreeze(data.room), this.manager);
        Utilities.deepFreeze(data.leavingUser);

        for (const appId of this.listeners.get(AppInterface.IPostRoomUserLeave)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_ROOM_USER_LEAVE)) {
                await app.call(
                    AppMethod.EXECUTE_POST_ROOM_USER_LEAVE,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    // External Components
    private async executePostExternalComponentOpened(data: IExternalComponent): Promise<void> {
        const cfExternalComponent = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostExternalComponentOpened)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTEPOSTEXTERNALCOMPONENTOPENED)) {
                await app.call(
                    AppMethod.EXECUTEPOSTEXTERNALCOMPONENTOPENED,
                    cfExternalComponent,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }
    }

    private async executePostExternalComponentClosed(data: IExternalComponent): Promise<void> {
        const cfExternalComponent = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostExternalComponentClosed)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTEPOSTEXTERNALCOMPONENTCLOSED)) {
                await app.call(
                    AppMethod.EXECUTEPOSTEXTERNALCOMPONENTCLOSED,
                    cfExternalComponent,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }
    }

    private async executeUIKitInteraction(data: IUIKitIncomingInteraction): Promise<IUIKitResponse> {
        const { appId, type } = data;

        const method = ((interactionType: string) => {
            switch (interactionType) {
                case UIKitIncomingInteractionType.BLOCK:
                    return AppMethod.UIKIT_BLOCK_ACTION;
                case UIKitIncomingInteractionType.VIEW_SUBMIT:
                    return AppMethod.UIKIT_VIEW_SUBMIT;
                case UIKitIncomingInteractionType.VIEW_CLOSED:
                    return AppMethod.UIKIT_VIEW_CLOSE;
                case UIKitIncomingInteractionType.ACTION_BUTTON:
                    return AppMethod.UIKIT_ACTION_BUTTON;
            }
        })(type);

        const app = this.manager.getOneById(appId);
        if (!app?.hasMethod(method)) {
            console.warn(`App ${appId} triggered an interaction but it doen't exist or doesn't have method ${method}`);
            return;
        }

        const interactionContext = ((interactionType: UIKitIncomingInteractionType, interactionData: IUIKitIncomingInteraction) => {
            const { actionId, message, user, room, triggerId, container } = interactionData;

            switch (interactionType) {
                case UIKitIncomingInteractionType.BLOCK: {
                    const { value, blockId } = interactionData.payload as { value: string; blockId: string };

                    return new UIKitBlockInteractionContext({
                        appId,
                        actionId,
                        blockId,
                        user,
                        room,
                        triggerId,
                        value,
                        message,
                        container,
                    });
                }
                case UIKitIncomingInteractionType.VIEW_SUBMIT: {
                    const { view } = interactionData.payload as { view: IUIKitSurface };

                    return new UIKitViewSubmitInteractionContext({
                        appId,
                        actionId,
                        view,
                        room,
                        triggerId,
                        user,
                    });
                }
                case UIKitIncomingInteractionType.VIEW_CLOSED: {
                    const { view, isCleared } = interactionData.payload as { view: IUIKitSurface; isCleared: boolean };

                    return new UIKitViewCloseInteractionContext({
                        appId,
                        actionId,
                        view,
                        room,
                        isCleared,
                        user,
                    });
                }
                case UIKitIncomingInteractionType.ACTION_BUTTON: {
                    const { context: buttonContext } = interactionData.payload as { context: UIActionButtonContext };

                    return new UIKitActionButtonInteractionContext({
                        appId,
                        actionId,
                        buttonContext,
                        room,
                        triggerId,
                        user,
                        message,
                    });
                }
            }
        })(type, data);

        return app.call(
            method,
            interactionContext,
            this.am.getReader(appId),
            this.am.getHttp(appId),
            this.am.getPersistence(appId),
            this.am.getModifier(appId),
        );
    }

    private async executeUIKitLivechatInteraction(data: IUIKitLivechatIncomingInteraction): Promise<IUIKitResponse> {
        const { appId, type } = data;

        const method = ((interactionType: string) => {
            switch (interactionType) {
                case UIKitIncomingInteractionType.BLOCK:
                    return AppMethod.UIKIT_LIVECHAT_BLOCK_ACTION;
            }
        })(type);

        const app = this.manager.getOneById(appId);
        if (!app.hasMethod(method)) {
            return;
        }

        const interactionContext = ((interactionType: UIKitIncomingInteractionType, interactionData: IUIKitLivechatIncomingInteraction) => {
            const { actionId, message, visitor, room, triggerId, container } = interactionData;

            switch (interactionType) {
                case UIKitIncomingInteractionType.BLOCK: {
                    const { value, blockId } = interactionData.payload as { value: string; blockId: string };

                    return new UIKitLivechatBlockInteractionContext({
                        appId,
                        actionId,
                        blockId,
                        visitor,
                        room,
                        triggerId,
                        value,
                        message,
                        container: container as IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer,
                    });
                }
            }
        })(type, data);

        return app.call(
            method,
            interactionContext,
            this.am.getReader(appId),
            this.am.getHttp(appId),
            this.am.getPersistence(appId),
            this.am.getModifier(appId),
        );
    }
    // Livechat
    private async executePostLivechatRoomStarted(data: ILivechatRoom): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatRoomStarted)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_ROOM_STARTED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_ROOM_STARTED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executeLivechatRoomClosedHandler(data: ILivechatRoom): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.ILivechatRoomClosedHandler)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatRoomClosed(data: ILivechatRoom): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatRoomClosed)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_ROOM_CLOSED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatAgentAssigned(data: ILivechatEventContext): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatAgentAssigned)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_AGENT_ASSIGNED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatAgentUnassigned(data: ILivechatEventContext): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatAgentUnassigned)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_AGENT_UNASSIGNED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatRoomTransferred(data: ILivechatTransferEventContext): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatRoomTransferred)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_ROOM_TRANSFERRED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatGuestSaved(data: IVisitor): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatGuestSaved)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_GUEST_SAVED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_GUEST_SAVED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostLivechatRoomSaved(data: ILivechatRoom): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostLivechatRoomSaved)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_LIVECHAT_ROOM_SAVED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_LIVECHAT_ROOM_SAVED,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    // FileUpload
    private async executePreFileUpload(data: IFileUploadContext): Promise<void> {
        const context = Object.freeze(data);

        for (const appId of this.listeners.get(AppInterface.IPreFileUpload)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_PRE_FILE_UPLOAD)) {
                await app.call(
                    AppMethod.EXECUTE_PRE_FILE_UPLOAD,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePreEmailSent(data: IPreEmailSentContext): Promise<IEmailDescriptor> {
        let descriptor = data.email;

        for (const appId of this.listeners.get(AppInterface.IPreEmailSent)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_PRE_EMAIL_SENT)) {
                descriptor = await app.call(
                    AppMethod.EXECUTE_PRE_EMAIL_SENT,
                    {
                        context: data.context,
                        email: descriptor,
                    },
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }

        return descriptor;
    }

    private async executePostMessageReacted(data: IMessageReactionContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessageReacted)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_MESSAGE_REACTED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_MESSAGE_REACTED,
                context,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostMessageFollowed(data: IMessageFollowContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessageFollowed)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_MESSAGE_FOLLOWED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_MESSAGE_FOLLOWED,
                context,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostMessagePinned(data: IMessagePinContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessagePinned)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_MESSAGE_PINNED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_MESSAGE_PINNED,
                context,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostMessageStarred(data: IMessageStarContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessageStarred)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_MESSAGE_STARRED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_MESSAGE_STARRED,
                context,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostMessageReported(data: IMessageReportContext): Promise<void> {
        const context = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessageReported)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_POST_MESSAGE_REPORTED)) {
                continue;
            }

            await app.call(
                AppMethod.EXECUTE_POST_MESSAGE_REPORTED,
                context,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
                this.am.getModifier(appId),
            );
        }
    }

    private async executePostUserCreated(data: IUserContext): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserCreated)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_CREATED)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_CREATED,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePostUserUpdated(data: IUserUpdateContext): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserUpdated)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_UPDATED)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_UPDATED,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePostUserDeleted(data: IUserContext): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserDeleted)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_DELETED)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_DELETED,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePostUserLoggedIn(data: IUser): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserLoggedIn)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_LOGGED_IN)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_LOGGED_IN,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }

    private async executePostUserLoggedOut(data: IUser): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserLoggedOut)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_LOGGED_OUT)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_LOGGED_OUT,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }
    private async executePostUserStatusChanged(data: IUserStatusContext): Promise<void> {
        const context = Utilities.deepFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostUserStatusChanged)) {
            const app = this.manager.getOneById(appId);

            if (app.hasMethod(AppMethod.EXECUTE_POST_USER_STATUS_CHANGED)) {
                await app.call(
                    AppMethod.EXECUTE_POST_USER_STATUS_CHANGED,
                    context,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
                );
            }
        }
    }
}
