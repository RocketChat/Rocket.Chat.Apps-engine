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
    public executeListener(int: AppInterface, data: IMessage | IRoom | IUser): void | boolean | IMessage | IRoom | IUser {
        switch (int) {
            case AppInterface.IPreMessageSentPrevent:
                return this.executePreMessageSentPrevent(data as IMessage);
            case AppInterface.IPreMessageSentExtend:
                return this.executePreMessageSentExtend(data as IMessage);
            case AppInterface.IPreMessageSentModify:
                return this.executePreMessageSentModify(data as IMessage);
            case AppInterface.IPostMessageSent:
                this.executePostMessageSent(data as IMessage);
                return;
            case AppInterface.IPreRoomCreatePrevent:
                return this.executePreRoomCreatePrevent(data as IRoom);
            case AppInterface.IPreRoomCreateExtend:
                return this.executePreRoomCreateExtend(data as IRoom);
            case AppInterface.IPreRoomCreateModify:
                return this.executePreRoomCreateModify(data as IRoom);
            case AppInterface.IPostRoomCreate:
                this.executePostRoomCreate(data as IRoom);
                return;
            default:
                console.warn('Unimplemented (or invalid) AppInterface was just tried to execute.');
                return;
        }
    }

    private executePreMessageSentPrevent(data: IMessage): boolean {
        let prevented = false;
        const cfMsg = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentPrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                continueOn = app.call(AppMethod.CHECKPREMESSAGESENTPREVENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                prevented = app.call(AppMethod.EXECUTEPREMESSAGESENTPREVENT,
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

    private executePreMessageSentExtend(data: IMessage): IMessage {
        const msg = data;
        const cfMsg = Utilities.deepCloneAndFreeze(msg);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentExtend)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTEXTEND)) {
                continueOn = app.call(AppMethod.CHECKPREMESSAGESENTEXTEND,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTEXTEND)) {
                app.call(AppMethod.EXECUTEPREMESSAGESENTEXTEND,
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

    private executePreMessageSentModify(data: IMessage): IMessage {
        let msg = data;
        const cfMsg = Utilities.deepCloneAndFreeze(msg);

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentModify)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTMODIFY)) {
                continueOn = app.call(AppMethod.CHECKPREMESSAGESENTMODIFY,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTMODIFY)) {
                msg = app.call(AppMethod.EXECUTEPREMESSAGESENTMODIFY,
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

    private executePostMessageSent(data: IMessage): void {
        const cfMsg = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostMessageSent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTMESSAGESENT)) {
                continueOn = app.call(AppMethod.CHECKPOSTMESSAGESENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTMESSAGESENT)) {
                app.call(AppMethod.EXECUTEPOSTMESSAGESENT,
                    cfMsg,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }
    }

    private executePreRoomCreatePrevent(data: IRoom): boolean {
        const cfRoom = Utilities.deepCloneAndFreeze(data);
        let prevented = false;

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreatePrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEPREVENT)) {
                continueOn = app.call(AppMethod.CHECKPREROOMCREATEPREVENT,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEPREVENT)) {
                prevented = app.call(AppMethod.EXECUTEPREROOMCREATEPREVENT,
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

    private executePreRoomCreateExtend(data: IRoom): IRoom {
        const room = data;
        const cfRoom = Utilities.deepCloneAndFreeze(room);

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreateExtend)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEEXTEND)) {
                continueOn = app.call(AppMethod.CHECKPREROOMCREATEEXTEND,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEEXTEND)) {
                app.call(AppMethod.EXECUTEPREROOMCREATEEXTEND,
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

    private executePreRoomCreateModify(data: IRoom): IRoom {
        let room = data;
        const cfRoom = Utilities.deepCloneAndFreeze(room);

        for (const appId of this.listeners.get(AppInterface.IPreRoomCreateModify)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREROOMCREATEMODIFY)) {
                continueOn = app.call(AppMethod.CHECKPREROOMCREATEMODIFY,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREROOMCREATEMODIFY)) {
                room = app.call(AppMethod.EXECUTEPREROOMCREATEMODIFY,
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

    private executePostRoomCreate(data: IRoom): void {
        const cfRoom = Utilities.deepCloneAndFreeze(data);

        for (const appId of this.listeners.get(AppInterface.IPostRoomCreate)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPOSTROOMCREATE)) {
                continueOn = app.call(AppMethod.CHECKPOSTROOMCREATE,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPOSTROOMCREATE)) {
                app.call(AppMethod.EXECUTEPOSTROOMCREATE,
                    cfRoom,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId),
                );
            }
        }
    }
}
