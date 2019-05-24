import { ILivechatCreator } from '../../definition/accessors/IModify';

import { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { IVisitor } from '../../definition/livechat/IVisitor';
import { IUser } from '../../definition/users';
import { AppBridges } from '../bridges';

export class LivechatCreator implements ILivechatCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) { }

    public createRoom(visitor: IVisitor, agent: IUser): Promise<ILivechatRoom> {
        return this.bridges.getLivechatBridge().createRoom(visitor, agent, this.appId);
    }

    public createVisitor(visitor: IVisitor): Promise<string> {
        return this.bridges.getLivechatBridge().createVisitor(visitor, this.appId);
    }
}
