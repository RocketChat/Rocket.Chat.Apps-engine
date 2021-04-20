import { IDepartment } from '../livechat';
import { ILivechatRoom } from '../livechat/ILivechatRoom';
import { IVisitor } from '../livechat/IVisitor';

export interface ILivechatRead {
    /**
     * Gets online status of the livechat.
     * @param departmentId (optional) the id of the livechat department
     * @deprecated use `isOnlineAsync` instead
     */
    isOnline(departmentId?: string): boolean;
    /**
     * Gets online status of the livechat.
     * @param departmentId (optional) the id of the livechat department
     */
    isOnlineAsync(departmentId?: string): Promise<boolean>;
    getDepartmentsEnabledWithAgents(): Promise<Array<IDepartment>>;
    getLivechatRooms(visitor: IVisitor, departmentId?: string): Promise<Array<ILivechatRoom>>;
    /**
     * @deprecated This method does not adhere to the conversion practices applied
     * elsewhere in the Apps-Engine and will be removed in the next major version.
     * Prefer the alternative methods to fetch visitors.
     */
    getLivechatVisitors(query: object): Promise<Array<IVisitor>>;
    getLivechatVisitorById(id: string): Promise<IVisitor | undefined>;
    getLivechatVisitorByEmail(email: string): Promise<IVisitor | undefined>;
    getLivechatVisitorByToken(token: string): Promise<IVisitor | undefined>;
    getLivechatVisitorByPhoneNumber(phoneNumber: string): Promise<IVisitor | undefined>;
    getLivechatDepartmentByIdOrName(value: string): Promise<IDepartment | undefined>;
}
