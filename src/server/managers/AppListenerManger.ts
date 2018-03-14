import { AppManager } from '../AppManager';
import { AppInterface } from '../compiler';
import { ProxiedApp } from '../ProxiedApp';
import { AppAccessorManager } from './AppAccessorManager';

import { IMessage } from '@rocket.chat/apps-ts-definition/messages';
import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { IRoom } from '@rocket.chat/apps-ts-definition/rooms';
import { IUser } from '@rocket.chat/apps-ts-definition/users';

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
            case AppInterface.IPostMessageSent:
                this.executePostMessageSent(data as IMessage);
                return;
        }
    }

    private executePreMessageSentPrevent(data: IMessage): boolean {
        let prevented = false;

        for (const appId of this.listeners.get(AppInterface.IPreMessageSentPrevent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                continueOn = app.call(AppMethod.CHECKPREMESSAGESENTPREVENT,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                prevented = app.call(AppMethod.EXECUTEPREMESSAGESENTPREVENT,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId)) as boolean;

                if (prevented) {
                    return prevented;
                }
            }
        }

        return prevented;
    }

    private executePostMessageSent(data: IMessage): void {
        for (const appId of this.listeners.get(AppInterface.IPostMessageSent)) {
            const app = this.manager.getOneById(appId);

            let continueOn = true;
            if (app.hasMethod(AppMethod.CHECKPREMESSAGESENTPREVENT)) {
                continueOn = app.call(AppMethod.CHECKPREMESSAGESENTPREVENT,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    ) as boolean;
            }

            if (continueOn && app.hasMethod(AppMethod.EXECUTEPREMESSAGESENTPREVENT)) {
                app.call(AppMethod.EXECUTEPREMESSAGESENTPREVENT,
                    data,
                    this.am.getReader(appId),
                    this.am.getHttp(appId),
                    this.am.getPersistence(appId));
            }
        }
    }
}
