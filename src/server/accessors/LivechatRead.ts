import { ILivechatRead } from '../../definition/accessors/ILivechatRead';
import { IDepartment } from '../../definition/livechat';
import { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { IVisitor } from '../../definition/livechat/IVisitor';
import { ILivechatBridge } from '../bridges/ILivechatBridge';
export class LivechatRead implements ILivechatRead {
    constructor(private readonly livechatBridge: ILivechatBridge, private readonly appId: string) { }

    public isOnline(): boolean {
        return this.livechatBridge.isOnline();
    }

    public getLivechatRooms(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>> {
        return this.livechatBridge.findRooms(visitor, departmentId, this.appId);
    }

    public getLivechatVisitors(query: object): Promise<Array<IVisitor>> {
        return this.livechatBridge.findVisitors(query, this.appId);
    }

    public getLivechatDepartments(query: object): Promise<Array<IDepartment>> {
        return this.livechatBridge.findDepartments(query, this.appId);
    }
}
