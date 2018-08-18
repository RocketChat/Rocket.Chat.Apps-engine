import { IMessageExtender, IModifyExtender, IRoomExtender } from '../../definition/accessors';
import { IUser } from '../../definition/users';
import { AppBridges } from '../bridges/AppBridges';
export declare class ModifyExtender implements IModifyExtender {
    private readonly bridges;
    private readonly appId;
    constructor(bridges: AppBridges, appId: string);
    extendMessage(messageId: string, updater: IUser): Promise<IMessageExtender>;
    extendRoom(roomId: string, updater: IUser): Promise<IRoomExtender>;
    finish(extender: IMessageExtender | IRoomExtender): Promise<void>;
}
