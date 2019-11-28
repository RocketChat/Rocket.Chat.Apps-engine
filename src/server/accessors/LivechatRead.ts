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

    public getLivechatVisitorsByEmail(email: string): Promise<Array<IVisitor>> {
        return this.livechatBridge.findVisitorsByEmail(email, this.appId);
    }

    public getLivechatVisitorsByPhoneNumber(phoneNumber: string): Promise<Array<IVisitor>> {
        return this.livechatBridge.findVisitorsByPhoneNumber(phoneNumber, this.appId);
    }

    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer the alternative methods to fetch departments.
     */
    public getLivechatDepartments(query: object): Promise<Array<IDepartment>> {
        return this.livechatBridge.findDepartments(query, this.appId);
    }

    public getLivechatDepartmentsByIdOrName(query: string): Promise<Array<IDepartment>> {
        return this.livechatBridge.findDepartmentsByIdOrName(query, this.appId);
    }
}
