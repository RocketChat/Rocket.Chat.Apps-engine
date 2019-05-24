import { ILivechatRead } from '../../definition/accessors/ILivechatRead';
import { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { IVisitor } from '../../definition/livechat/IVisitor';
import { ILivechatBridge } from '../bridges/ILivechatBridge';
export class LivechatRead implements ILivechatRead {
    constructor(private readonly livechatBridge: ILivechatBridge, private readonly appId: string) { }

    public getLivechatRoom(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>> {
        return this.livechatBridge.findRooms(visitor, departmentId, this.appId);
    }

    public getLivechatVisitor(query: object): Promise<Array<IVisitor>> {
        return this.livechatBridge.findVisitors(query, this.appId);
    }
}
