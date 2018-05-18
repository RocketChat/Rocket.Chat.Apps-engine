import { MessageBuilder, MessageExtender, RoomBuilder, RoomExtender } from '../accessors';
import { AppManager } from '../AppManager';
import { AppInterface } from '../compiler';
import { ProxiedApp } from '../ProxiedApp';
import { AppAccessorManager } from './AppAccessorManager';

import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';
import { Utilities } from '../misc/Utilities';

export class AppListenerManger {
    private am: AppAccessorManager;
    private listeners: Map<string, Array<string>>;

    constructor(private readonly manager: AppManager) {
        this.am = manager.getAccessorManager();
        this.listeners = new Map<string, Array<string>>();

        Object.keys(AppInterface).forEach((intt) => this.listeners.set(intt, new Array<string>()));
    }

    public registerListeners(app: ProxiedApp): void {
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
    public async executeListener(int: AppInterface, data: IMessage | IRoom | IUser): Promise<void | boolean | IMessage | IRoom | IUser> {
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
            default:
                console.warn('Unimplemented (or invalid) AppInterface was just tried to execute.');
                return;
        }
    }

    // Messages
    private async executePreMessageSentPrevent(data: IMessage): Promise<boolean> {
        let prevented = false;
        const cfMsg = Utilities.deepCloneAndFreeze(data);

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
        const cfMsg = Utilities.deepCloneAndFreeze(msg);

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
        const cfMsg = Utilities.deepCloneAndFreeze(msg);

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
        const cfMsg = Utilities.deepCloneAndFreeze(data);

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
                );
            }
        }
    }

    private async executePreMessageDeletePrevent(data: IMessage): Promise<boolean> {
        let prevented = false;
        const cfMsg = Utilities.deepCloneAndFreeze(data);

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
        const cfMsg = Utilities.deepCloneAndFreeze(data);

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
                );
            }
        }
    }

    // Rooms
    private async executePreRoomCreatePrevent(data: IRoom): Promise<boolean> {
        const cfRoom = Utilities.deepCloneAndFreeze(data);
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
        const cfRoom = Utilities.deepCloneAndFreeze(room);

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
        const cfRoom = Utilities.deepCloneAndFreeze(room);

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
        const cfRoom = Utilities.deepCloneAndFreeze(data);

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
        const cfRoom = Utilities.deepCloneAndFreeze(data);
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
        const cfRoom = Utilities.deepCloneAndFreeze(data);

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
}
