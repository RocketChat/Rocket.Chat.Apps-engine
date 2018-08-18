import { AppManager } from '../AppManager';
import { AppInterface } from '../compiler';
import { ProxiedApp } from '../ProxiedApp';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUser } from '../../definition/users';
export declare class AppListenerManger {
    private readonly manager;
    private am;
    private listeners;
    constructor(manager: AppManager);
    registerListeners(app: ProxiedApp): void;
    unregisterListeners(app: ProxiedApp): void;
    getListeners(int: AppInterface): Array<ProxiedApp>;
    executeListener(int: AppInterface, data: IMessage | IRoom | IUser): Promise<void | boolean | IMessage | IRoom | IUser>;
    private executePreMessageSentPrevent(data);
    private executePreMessageSentExtend(data);
    private executePreMessageSentModify(data);
    private executePostMessageSent(data);
    private executePreMessageDeletePrevent(data);
    private executePostMessageDelete(data);
    private executePreRoomCreatePrevent(data);
    private executePreRoomCreateExtend(data);
    private executePreRoomCreateModify(data);
    private executePostRoomCreate(data);
    private executePreRoomDeletePrevent(data);
    private executePostRoomDeleted(data);
}
