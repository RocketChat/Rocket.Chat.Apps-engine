import { IMessageBuilder, IModifyUpdater, IRoomBuilder } from '../../definition/accessors';
import { IUser } from '../../definition/users';
import { AppBridges } from '../bridges';
export declare class ModifyUpdater implements IModifyUpdater {
    private readonly bridges;
    private readonly appId;
    constructor(bridges: AppBridges, appId: string);
    message(messageId: string, updater: IUser): Promise<IMessageBuilder>;
    room(roomId: string, updater: IUser): Promise<IRoomBuilder>;
    finish(builder: IMessageBuilder | IRoomBuilder): Promise<void>;
    private _finishMessage(builder);
    private _finishRoom(builder);
}
