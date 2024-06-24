import type { ILivechatCreator } from '../../definition/accessors';
import type { IExtraRoomParams } from '../../definition/accessors/ILivechatCreator';
import type { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import type { IVisitor } from '../../definition/livechat/IVisitor';
import type { IUser } from '../../definition/users';
import type { AppBridges } from '../bridges';

export class LivechatCreator implements ILivechatCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public createRoom(visitor: IVisitor, agent: IUser, extraParams?: IExtraRoomParams): Promise<ILivechatRoom> {
        return this.bridges.getLivechatBridge().doCreateRoom(visitor, agent, this.appId, extraParams);
    }

    public createVisitor(visitor: IVisitor): Promise<IVisitor | undefined> {
        return this.bridges.getLivechatBridge().doCreateVisitor(visitor, this.appId);
    }

    public createToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
