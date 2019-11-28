import { IDepartment } from '../livechat';
import { ILivechatRoom } from '../livechat/ILivechatRoom';
import { IVisitor } from '../livechat/IVisitor';

export interface ILivechatRead {
    isOnline(): boolean;
    getLivechatRooms(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer the alternative methods to fetch visitors.
     */
    getLivechatVisitors(query: object): Promise<Array<IVisitor>>;
    getLivechatVisitorById(id: string): Promise<IVisitor | undefined>;
    getLivechatVisitorsByEmail(email: string): Promise<Array<IVisitor>>;
    getLivechatVisitorsByPhoneNumber(phoneNumber: string): Promise<Array<IVisitor>>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer the alternative methods to fetch departments.
     */
    getLivechatDepartments(query: object): Promise<Array<IDepartment>>;
    getLivechatDepartmentsByIdOrName(query: string): Promise<Array<IDepartment>>;
}
