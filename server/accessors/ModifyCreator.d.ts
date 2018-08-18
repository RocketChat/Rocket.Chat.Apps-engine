import { IMessageBuilder, IModifyCreator, IRoomBuilder } from '../../definition/accessors';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { AppBridges } from '../bridges';
export declare class ModifyCreator implements IModifyCreator {
    private readonly bridges;
    private readonly appId;
    constructor(bridges: AppBridges, appId: string);
    startMessage(data?: IMessage): IMessageBuilder;
    startRoom(data?: IRoom): IRoomBuilder;
    finish(builder: IMessageBuilder | IRoomBuilder): Promise<string>;
    private _finishMessage(builder);
    private _finishRoom(builder);
}
