import { ILivechatCreator } from '../../definition/accessors';

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

    public createToken(): string {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }
}
