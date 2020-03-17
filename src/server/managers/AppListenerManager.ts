import { ILivechatRoom } from '../../definition/livechat';
import { IMessage } from '../../definition/messages';
import { AppMethod } from '../../definition/metadata';
import { IRoom } from '../../definition/rooms';
import { IUIKitIncomingInteraction, IUIKitResponse, IUIKitView, UIKitIncomingInteractionType } from '../../definition/uikit';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
} from '../../definition/uikit/UIKitIncomingInteractionContainer';
import {
    UIKitBlockInteractionContext,
    UIKitViewCloseInteractionContext,
    UIKitViewSubmitInteractionContext,
} from '../../definition/uikit/UIKitInteractionContext';
import { IUser } from '../../definition/users';
import { MessageBuilder, MessageExtender, RoomBuilder, RoomExtender } from '../accessors';
import { AppManager } from '../AppManager';
import { AppInterface } from '../compiler';
import { Message } from '../messages/Message';
import { Utilities } from '../misc/Utilities';
import { ProxiedApp } from '../ProxiedApp';
import { Room } from '../rooms/Room';
import { AppAccessorManager } from './AppAccessorManager';

export class AppListenerManager {
    private am: AppAccessorManager;
    private listeners: Map<string, Array<string>>;

    constructor(private readonly manager: AppManager) {
        this.am = manager.getAccessorManager();
        this.listeners = new Map<string, Array<string>>();

        Object.keys(AppInterface).forEach((intt) => this.listeners.set(intt, new Array<string>()));
    }

    public registerListeners(app: ProxiedApp): void {
        this.unregisterListeners(app);
        const impleList = app.getImplementationList();
        for (const int in app.getImplementationList()) {
            if (impleList[int]) {
                this.listeners.get(int).push(app.getID());
            }
        }
    }

    public unregisterListeners(app: ProxiedApp): void {
        this.listeners.forEach((apps, int) => {
            if (apps.includes(app.getID())) {
                const where = apps.indexOf(app.getID());
                this.listeners.get(int).splice(where, 1);
            }
        });
    }

    public getListeners(int: AppInterface): Array<ProxiedApp> {
        const results = new Array<ProxiedApp>();

        for (const appId of this.listeners.get(int)) {
            results.push(this.manager.getOneById(appId));
        }

        return results;
    }

    // tslint:disable-next-line
    public async executeListener(int: AppInterface, data: IMessage | IRoom | IUser | IUIKitIncomingInteraction | ILivechatRoom): Promise<void | boolean | IMessage | IRoom | IUser | IUIKitResponse | ILivechatRoom> {
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
                this.executePostMessageDelete(data as IMessage);
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
            case AppInterface.IUIKitInteractionHandler:
                return this.executeUIKitInteraction(data as IUIKitIncomingInteraction);
            // Livechat
            case AppInterface.ILivechatRoomClosedHandler:
                this.executeLivechatRoomClosed(data as ILivechatRoom);
                return;
            case AppInterface.IPreFileUploadAllow:
                return this.executePreFileUploadAllow(data);
            default:
                console.warn('Unimplemented (or invalid) AppInterface was just tried to execute.');
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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGESENTPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                prevented = await app.call(AppMethod.EXECUTEPREMESSAGESENTPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as boolean;

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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGESENTEXTEND,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTEXTEND)) {
                await app.call(AppMethod.EXECUTEPREMESSAGESENTEXTEND,
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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGESENTMODIFY,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTMODIFY)) {
                msg = await app.call(AppMethod.EXECUTEPREMESSAGESENTMODIFY,
                    cfMsg,
                    new MessageBuilder(msg),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as IMessage;
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
                continueOn = await app.call(AppMethod.CHECKPOSTMESSAGESENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGESENT)) {
                await app.call(AppMethod.EXECUTEPOSTMESSAGESENT,
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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGEDELETEPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEDELETEPREVENT)) {
                prevented = await app.call(AppMethod.EXECUTEPREMESSAGEDELETEPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private async executePostMessageDelete(data: IMessage): Promise<void> {
        const cfMsg = new Message(Utilities.deepCloneAndFreeze(data), this.manager);

        for (const appId of this.listeners.get(AppInterface.IPostMessageDeleted)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTMESSAGEDELETED)) {
                continueOn = await app.call(AppMethod.CHECKPOSTMESSAGEDELETED,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGEDELETED)) {
                await app.call(AppMethod.EXECUTEPOSTMESSAGEDELETED,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                    this.am.getModifier(appId),
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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGEUPDATEDPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT)) {
                prevented = await app.call(AppMethod.EXECUTEPREMESSAGEUPDATEDPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as boolean;

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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGEUPDATEDEXTEND,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND)) {
                await app.call(AppMethod.EXECUTEPREMESSAGEUPDATEDEXTEND,
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
                continueOn = await app.call(AppMethod.CHECKPREMESSAGEUPDATEDMODIFY,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY)) {
                msg = await app.call(AppMethod.EXECUTEPREMESSAGEUPDATEDMODIFY,
                    cfMsg,
                    new MessageBuilder(msg),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as IMessage;
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
                continueOn = await app.call(AppMethod.CHECKPOSTMESSAGEUPDATED,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGEUPDATED)) {
                await app.call(AppMethod.EXECUTEPOSTMESSAGEUPDATED,
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
                continueOn = await app.call(AppMethod.CHECKPREROOMCREATEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEPREVENT)) {
                prevented = await app.call(AppMethod.EXECUTEPREROOMCREATEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as boolean;

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
                continueOn = await app.call(AppMethod.CHECKPREROOMCREATEEXTEND,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEEXTEND)) {
                await app.call(AppMethod.EXECUTEPREROOMCREATEEXTEND,
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
                continueOn = await app.call(AppMethod.CHECKPREROOMCREATEMODIFY,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEMODIFY)) {
                room = await app.call(AppMethod.EXECUTEPREROOMCREATEMODIFY,
                    cfRoom,
                    new RoomBuilder(room),
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as IRoom;
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
                continueOn = await app.call(AppMethod.CHECKPOSTROOMCREATE,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTROOMCREATE)) {
                await app.call(AppMethod.EXECUTEPOSTROOMCREATE,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
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
                continueOn = await app.call(AppMethod.CHECKPREROOMDELETEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMDELETEPREVENT)) {
                prevented = await app.call(AppMethod.EXECUTEPREROOMDELETEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as boolean;

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
                continueOn = await app.call(AppMethod.CHECKPOSTROOMDELETED,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTROOMDELETED)) {
                await app.call(AppMethod.EXECUTEPOSTROOMDELETED,
                    cfRoom,
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
            }
        })(type);

        const app = this.manager.getOneById(appId);
        if (!app.hasMethod(method)) {
            return;
        }

        const interactionContext = ((interactionType: UIKitIncomingInteractionType, interactionData: IUIKitIncomingInteraction) => {
            const {
                actionId,
                message,
                user,
                room,
                triggerId,
                container,
            } = interactionData;

            switch (interactionType) {
                case UIKitIncomingInteractionType.BLOCK: {
                    const { value } = interactionData.payload as { value: string };

                    return new UIKitBlockInteractionContext({
                        appId,
                        actionId,
                        user,
                        room,
                        triggerId,
                        value,
                        message,
                        container: container as IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer,
                    });
                }
                case UIKitIncomingInteractionType.VIEW_SUBMIT: {
                    const { view } = interactionData.payload as { view: IUIKitView };

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
                    const { view, isCleared } = interactionData.payload as { view: IUIKitView, isCleared: boolean };

                    return new UIKitViewCloseInteractionContext({
                        appId,
                        actionId,
                        view,
                        room,
                        isCleared,
                        user,
                    });
                }
            }
        })(type, data);

        return app.call(method,
            interactionContext,
            this.am.getReader(appId),
            this.am.getHttp(appId),
            this.am.getPersistence(appId),
            this.am.getModifier(appId),
        );
    }
    // Livechat
    private async executeLivechatRoomClosed(data: ILivechatRoom): Promise<void> {
        const cfLivechatRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.ILivechatRoomClosedHandler)) {
            const app = this.manager.getOneById(appId);

            if (!app.hasMethod(AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER)) {
                continue;
            }

            await app.call(AppMethod.EXECUTE_LIVECHAT_ROOM_CLOSED_HANDLER,
                cfLivechatRoom,
                this.am.getReader(appId),
                this.am.getHttp(appId),
                this.am.getPersistence(appId),
            );
        }
    }
    private async executePreFileUploadAllow(data: any): Promise<boolean> {

        for (const appId of this.listeners.get(AppInterface.IPreFileUploadAllow)) {
            const app = this.manager.getOneById(appId);
            if (app.hasMethod(AppMethod.CHECK_PRE_FILEUPLOAD_ALLOW)) {
                const continueOn = await app.call(AppMethod.CHECK_PRE_FILEUPLOAD_ALLOW,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;

                if (!continueOn) {
                    continue;
                }
            }

            if (app.hasMethod(AppMethod.EXECUTE_PRE_FILEUPLOAD_ALLOW)) {
                const result = await app.call(AppMethod.EXECUTE_PRE_FILEUPLOAD_ALLOW,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                ) as Error || null || Boolean;

                if (typeof result === 'boolean' && result === true) {
                    return result;
                }

                if (result instanceof Error) {
                    throw result;
                }
            }
        }
        throw new Error('error-invalid-file-type');
    }
}
