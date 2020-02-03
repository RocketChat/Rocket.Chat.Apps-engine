import { ILivechatRead } from '../../definition/accessors/ILivechatRead';
import { IDepartment } from '../../definition/livechat';
import { ILivechatRoom } from '../../definition/livechat/ILivechatRoom';
import { IVisitor } from '../../definition/livechat/IVisitor';
import { ILivechatBridge } from '../bridges/ILivechatBridge';
export class LivechatRead implements ILivechatRead {
    constructor(private readonly livechatBridge: ILivechatBridge, private readonly appId: string) { }

    public isOnline(departmentId?: string): boolean {
        return this.livechatBridge.isOnline(departmentId);
    }

    public getLivechatRooms(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>> {
        return this.livechatBridge.findRooms(visitor, departmentId, this.appId);
    }

    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer the alternative methods to fetch visitors.
     */
    public getLivechatVisitors(query: object): Promise<Array<IVisitor>> {
        return this.livechatBridge.findVisitors(query, this.appId);
    }

    public getLivechatVisitorById(id: string): Promise<IVisitor | undefined> {
        return this.livechatBridge.findVisitorById(id, this.appId);
    }

    public getLivechatVisitorByEmail(email: string): Promise<IVisitor | undefined> {
        return this.livechatBridge.findVisitorByEmail(email, this.appId);
    }

    public getLivechatVisitorByToken(token: string): Promise<IVisitor | undefined> {
        return this.livechatBridge.findVisitorByToken(token, this.appId);
    }

    public getLivechatVisitorByPhoneNumber(phoneNumber: string): Promise<IVisitor | undefined> {
        return this.livechatBridge.findVisitorByPhoneNumber(phoneNumber, this.appId);
    }

    public getLivechatDepartmentByIdOrName(value: string): Promise<IDepartment | undefined> {
        return this.livechatBridge.findDepartmentByIdOrName(value, this.appId);
    }
}
